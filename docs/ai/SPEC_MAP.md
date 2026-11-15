# Specification reference map

## Evidence classes

- **Explicitly approved/accepted:** the referenced decision or spec states acceptance; record the exact decision, not approval of the entire surrounding file.
- **Authoritative baseline:** a document calls itself a source of truth; its separate approval date was not independently established here. Check later accepted amendments and the user's task.
- **Historical implementation:** describes a branch, draft PR or a dated build; neither a new requirement nor current release evidence.
- **Proposal / unverified approval:** do not implement as an approved requirement solely because a file or UI exists.
- **Current implementation:** actual frontend files in [DOMAIN_MAP.md](DOMAIN_MAP.md); source existence is not proof of product approval or successful deployment.

Specifications reside in the independent operations repository. Sibling links work only when operations is checked out next to this frontend. They are read-only knowledge references, never runtime/build imports. Without that checkout, use local knowledge maps for preservation and obtain a missing material decision before changing behavior.

## Classified registry

| ID / source | Evidence class | Status evidence and interpretation |
| --- | --- | --- |
| [ACQUIRE](../../../operations/docs/03-ui-ux/RESTAURANT_ACQUISITION_SOURCE_IMPLEMENTATION.md) | Historical draft implementation record | Header records draft implementation and pending migration/QA; private platform data. |
| [API](../../../operations/docs/02-technical/API_CONVENTIONS.md) | Self-described authoritative API baseline | Contract reference with later amendments; exact current requests are evidenced by source, not invented from module names. |
| [AUTH](../../../operations/docs/02-technical/AUTH_TENANCY_SPEC.md) | Self-described authoritative auth baseline | Separate guest, restaurant and platform identities and tenant/branch scope. |
| [CONTACT](../../../operations/docs/03-ui-ux/RESTAURANT_OWNER_CONTACTS_IMPLEMENTATION.md) | Historical draft implementation record | Header records draft code and no completed DB/browser QA in that run. |
| [CONTRACT](../../../operations/docs/03-ui-ux/CONTRACT_DRAFTS_AND_MENU_SUBDOMAINS.md) | Owner-request implementation/amendment record | 2026-11-09 local implementation; amends DEC-049/066. Not evidence of deployment. |
| [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md) | Accepted decisions and mixed-status amendments | Read each DEC status; DEC-062 is Proposed; DEC-067 and DEC-068 record built work with release gates. A file title is not approval of every section. |
| [DEMO](../../../operations/docs/01-domain/DEMO_RESTAURANTS_SPEC.md) | Implemented specification tied to accepted decisions | DEC-060/061 accepted; expiry/purge deployment is not verified by frontend existence. |
| [DESIGN](../../../operations/docs/03-ui-ux/DESIGN_SYSTEM.md) | Design baseline reference | Preserve current supplied assets/copy; design reference does not prove rendered equivalence. |
| [I18N](../../../operations/docs/01-domain/I18N_SPEC.md) | Self-described authoritative locale baseline | Read with accepted DEC-037; preserve runtime locale contracts. |
| [MOTION](../../../operations/docs/03-ui-ux/MOTION_ACCESSIBILITY_SPEC.md) | Motion/accessibility baseline reference | Keyboard/focus/reduced-motion checks require actual verification for affected UI. |
| [SEC](../../../operations/docs/02-technical/SECURITY_SPEC.md) | Self-described authoritative security baseline | Use relevant sections; no new security implementation in Phase 1. |
| [SPLIT](../../../operations/docs/02-technical/STANDALONE_REPOSITORIES.md) | Current repository decision | 2026-11-12 explicit standalone extraction; supersedes historical workspace paths, not business rules. |

## Domain reference map

| Domain | Related references | Decision scope / constraint |
| --- | --- | --- |
| [activity](DOMAIN_MAP.md#activity) | [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md), [AUTH](../../../operations/docs/02-technical/AUTH_TENANCY_SPEC.md), [API](../../../operations/docs/02-technical/API_CONVENTIONS.md) | DEC-045 |
| [auth](DOMAIN_MAP.md#auth) | [AUTH](../../../operations/docs/02-technical/AUTH_TENANCY_SPEC.md), [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md) | DEC-045 |
| [billing](DOMAIN_MAP.md#billing) | [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md), [API](../../../operations/docs/02-technical/API_CONVENTIONS.md) | DEC-049, DEC-056 |
| [contracts](DOMAIN_MAP.md#contracts) | [CONTRACT](../../../operations/docs/03-ui-ux/CONTRACT_DRAFTS_AND_MENU_SUBDOMAINS.md), [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md), [API](../../../operations/docs/02-technical/API_CONVENTIONS.md) | DEC-049; CONTRACT amends DEC-049/066 |
| [dashboard](DOMAIN_MAP.md#dashboard) | [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md), [AUTH](../../../operations/docs/02-technical/AUTH_TENANCY_SPEC.md), [API](../../../operations/docs/02-technical/API_CONVENTIONS.md) | DEC-045 |
| [demos](DOMAIN_MAP.md#demos) | [DEMO](../../../operations/docs/01-domain/DEMO_RESTAURANTS_SPEC.md), [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md) | DEC-060, DEC-061 |
| [leads](DOMAIN_MAP.md#leads) | [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md), [AUTH](../../../operations/docs/02-technical/AUTH_TENANCY_SPEC.md), [API](../../../operations/docs/02-technical/API_CONVENTIONS.md) | DEC-053 |
| [packages](DOMAIN_MAP.md#packages) | [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md), [API](../../../operations/docs/02-technical/API_CONVENTIONS.md) | DEC-046, DEC-051, DEC-052 |
| [requests](DOMAIN_MAP.md#requests) | [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md), [AUTH](../../../operations/docs/02-technical/AUTH_TENANCY_SPEC.md), [API](../../../operations/docs/02-technical/API_CONVENTIONS.md) | DEC-050 |
| [restaurants](DOMAIN_MAP.md#restaurants) | [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md), [AUTH](../../../operations/docs/02-technical/AUTH_TENANCY_SPEC.md), [CONTACT](../../../operations/docs/03-ui-ux/RESTAURANT_OWNER_CONTACTS_IMPLEMENTATION.md), [ACQUIRE](../../../operations/docs/03-ui-ux/RESTAURANT_ACQUISITION_SOURCE_IMPLEMENTATION.md), [CONTRACT](../../../operations/docs/03-ui-ux/CONTRACT_DRAFTS_AND_MENU_SUBDOMAINS.md) | DEC-047, DEC-066 |
| [settings](DOMAIN_MAP.md#settings) | [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md), [API](../../../operations/docs/02-technical/API_CONVENTIONS.md), [SEC](../../../operations/docs/02-technical/SECURITY_SPEC.md) | DEC-055, DEC-056, DEC-059 |
| [team](DOMAIN_MAP.md#team) | [DEC](../../../operations/docs/00-product/PROJECT_DECISIONS.md), [AUTH](../../../operations/docs/02-technical/AUTH_TENANCY_SPEC.md), [API](../../../operations/docs/02-technical/API_CONVENTIONS.md) | DEC-048 |

## Conflicts and missing evidence

The standalone extraction decision supersedes the old monorepo/workspace locations in technical baselines and DEC-023; it does not change business authorization or pricing rules. Historical `apps/web` and `apps/platform` paths must be resolved to the current owners, not recreated as directories.

Multiple product decisions have proposal/implementation-only status. In particular DEC-062 and DEC-067 must not be flattened into a blanket statement that every shipped renderer has owner approval. Preserve current behavior for unrelated tasks and resolve the exact decision when changing it.

The restaurant-setup UX proposal explicitly records no approval, while its implementation record and current web source contain setup functionality. That is an unresolved documentary approval conflict, not authorization to delete working code or change operations records. See [the gap analysis](GOVERNANCE_AUDIT.md).

Future proposals under operations/docs/05-future-proposals and archived monorepo instructions are historical/planning context. Do not treat them as current feature requirements. No backend contract or operations document was changed in Phase 1.
