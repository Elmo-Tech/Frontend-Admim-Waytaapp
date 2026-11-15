'use client';
import { createExclusiveTask } from '@/lib/utils/async-control';
import { apiErrorKey } from '@/lib/api/error-key';
import { ApiError } from '@/lib/api/errors';
import { useI18n } from '@/lib/i18n/client';
import { packageErrorKey } from '@/modules/packages/api/errors';
import {
  createPackage,
  deletePackage,
  getPackage,
  updatePackage,
} from '@/modules/packages/api/packages';
import { type PackageDetail } from '@/modules/packages/types/package';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import {
  EMPTY,
  FIELD_IDS,
  formFrom,
  toInput,
  validatePackageForm,
  type FieldErrors,
  type FieldName,
  type FormState,
  type PriceField,
} from '../utils/package-form';

export function usePackageEditor(packageId: string | null) {
  const { t, fmt, locale } = useI18n();
  const router = useRouter();
  const creating = packageId === null;
  const [mutations] = useState(createExclusiveTask);

  const [loadVersion, setLoadVersion] = useState(0);
  const [pkg, setPkg] = useState<PackageDetail | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [failure, setFailure] = useState<'notFound' | 'error' | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<'package.saved' | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (packageId === null) return;
    let cancelled = false;
    getPackage(packageId)
      .then((loaded) => {
        if (cancelled) return;
        setPkg(loaded);
        setForm(formFrom(loaded));
      })
      .catch((caught: unknown) => {
        if (cancelled) return;
        setFailure(
          caught instanceof ApiError && caught.status === 404
            ? 'notFound'
            : 'error',
        );
      });
    return () => {
      cancelled = true;
    };
  }, [packageId, loadVersion]);

  function retryLoad() {
    setFailure(null);
    setPkg(null);
    setLoadVersion((version) => version + 1);
  }

  const describe = (caught: unknown): string => {
    const key = packageErrorKey(caught);
    if (key) return t(key);
    return t(apiErrorKey(caught));
  };

  const clearFieldError = (field: FieldName) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (
      key === 'nameAr' ||
      key === 'nameEn' ||
      key === 'offerPercent' ||
      key === 'offerEndsAt'
    ) {
      clearFieldError(key);
    }
    setNotice(null);
  };
  const setPrice = (field: PriceField, value: string) => {
    setForm((current) => ({
      ...current,
      prices: { ...current.prices, [field]: value },
    }));
    clearFieldError(field);
    setNotice(null);
  };

  async function submit(event: FormEvent) {
    event.preventDefault();
    await mutations.run(async () => {
      if (busy) return;
      const errors = validatePackageForm(form, t);
      setNotice(null);
      setProblem(null);
      setFieldErrors(errors);
      const firstInvalid = Object.keys(errors)[0] as FieldName | undefined;
      if (firstInvalid) {
        requestAnimationFrame(() =>
          document.getElementById(FIELD_IDS[firstInvalid])?.focus(),
        );
        return;
      }
      setBusy(true);
      try {
        if (creating) {
          await createPackage(toInput(form));
          router.push('/packages');
          return;
        }
        const saved = await updatePackage(packageId, toInput(form));
        setPkg((current) => (current ? { ...current, ...saved } : current));
        setForm((current) => ({
          ...current,
          prices: {
            egpMonthly: saved.prices.egpMonthly ?? '',
            egpYearly: saved.prices.egpYearly ?? '',
            usdMonthly: saved.prices.usdMonthly ?? '',
            usdYearly: saved.prices.usdYearly ?? '',
          },
          offerPercent: saved.offer?.percent ?? current.offerPercent,
        }));
        setNotice('package.saved');
      } catch (caught) {
        setProblem(describe(caught));
      } finally {
        setBusy(false);
      }
    });
  }

  async function changeStatus() {
    await mutations.run(async () => {
      if (!pkg || busy) return;
      setBusy(true);
      setProblem(null);
      setNotice(null);
      try {
        const saved = await updatePackage(pkg.id, {
          status: pkg.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE',
        });
        setPkg({ ...pkg, ...saved });
      } catch (caught) {
        setProblem(describe(caught));
      } finally {
        setBusy(false);
      }
    });
  }

  async function remove() {
    await mutations.run(async () => {
      if (!pkg || busy) return;
      setBusy(true);
      setProblem(null);
      try {
        await deletePackage(pkg.id);
        router.push('/packages');
      } catch (caught) {
        setProblem(describe(caught));
        setConfirmingDelete(false);
        setBusy(false);
      }
    });
  }

  return {
    retryLoad,
    t,
    fmt,
    locale,
    router,
    creating,
    pkg,
    form,
    failure,
    busy,
    notice,
    problem,
    fieldErrors,
    confirmingDelete,
    setConfirmingDelete,
    set,
    setPrice,
    submit,
    changeStatus,
    remove,
  };
}
