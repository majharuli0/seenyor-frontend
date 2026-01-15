import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { VscLoading } from 'react-icons/vsc';

export default function Modal({
  isVisible,
  setIsVisible,
  onOk,
  onCancel,
  title,
  description,
  children,
  okText = 'OK',
  cancelText = 'Cancel',
  okLoading: externalOkLoading = false,
  okDisabled = false,
  showFooter = true,
  className = '',
  showCloseButton = true,
  footerAlign = 'right', // "left", "center", "right"
  footerButtons = 'both', // "both", "ok", "cancel"
}) {
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    if (submitting) return;
    setIsVisible(false);
    if (onCancel) onCancel();
  };

  const handleOk = async () => {
    if (!onOk) return setIsVisible(false);
    try {
      setSubmitting(true);
      await onOk();
      setIsVisible(false);
    } catch (err) {
      console.error('Modal onOk error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Footer alignment classes
  const alignClass =
    footerAlign === 'center'
      ? '!justify-center'
      : footerAlign === 'left'
        ? '!justify-start'
        : '!justify-end';

  return (
    <Dialog open={isVisible} onOpenChange={setIsVisible}>
      <DialogContent
        className={`sm:max-w-lg rounded-xl border-border w-full z-[999999] ${className}`}
        showCloseButton={showCloseButton}
      >
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}

        <div>{children}</div>

        {showFooter && (
          <DialogFooter className={`mt-6 flex w-full gap-2 ${alignClass}`}>
            {(footerButtons === 'both' || footerButtons === 'cancel') && (
              <Button
                variant='outline'
                onClick={handleClose}
                disabled={submitting || externalOkLoading}
              >
                {cancelText}
              </Button>
            )}

            {(footerButtons === 'both' || footerButtons === 'ok') && (
              <Button onClick={handleOk} disabled={okDisabled || submitting || externalOkLoading}>
                {(submitting || externalOkLoading) && <VscLoading className='animate-spin mr-2' />}
                {okText}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
