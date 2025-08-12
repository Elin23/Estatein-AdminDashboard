export type EmailReplyProps = {
  open?: boolean;
  title?: string;
  onClose?: () => void;
  onSubmit?: (data: { to: string; subject: string; message: string }) => void;
  loading?: boolean;
  error?: string | null;
  success?: boolean;
  defaultEmail?: string;
  defaultSubject?: string;
  defaultMessage?: string;
};


export type EmailFormProps = {
  className?: string;
  submitLabel?: string;
  cancelLabel?: string;
  showCancel?: boolean;
  onCancel?: () => void;
  defaultEmail?: string;
  defaultSubject?: string;
  defaultMessage?: string;
  onSubmit?: (data: { to: string; subject: string; message: string }) => void;
  loading?: boolean;
};