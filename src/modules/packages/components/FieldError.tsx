export function FieldError({ controlId, message }: { controlId: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${controlId}-error`} role="alert" className="mt-1.5 text-xs font-medium text-danger">
      {message}
    </p>
  );
}
