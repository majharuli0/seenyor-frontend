import { useState, useEffect } from 'react';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { toast } from '../common/toast';
import { Textarea } from '../ui/textarea';
import { useAlertLogSet } from '@/MonitoringService/hooks/useAlert';
import { useParams } from 'react-router-dom';

/**
 * @param {string} contactName - Name of the contact person
 * @param {string} contactType - e.g., "emergency contact"
 * @param {string} contactNumber - Phone number
 * @param {boolean} [autoOpen=false] - If true, skips the toggle and directly shows the note box
 * @param {string} [placeholder] - Custom placeholder text for the textarea
 */
export default function CallNoteSection({
  modalShow,
  setModalShow,
  contactName,
  contactType,
  contactNumber,
  contactCode,
  autoOpen = false,
  placeholder,
}) {
  const { id } = useParams();
  const [contacted, setContacted] = useState(autoOpen);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const { mutate: setlog, isPending, isSuccess } = useAlertLogSet();
  useEffect(() => {
    setContacted(autoOpen);
  }, [autoOpen]);
  useEffect(() => {
    if (contactType == 'device_call' && !modalShow && note == '') {
      const payload = {
        status: 'called',
        contact_name: contactName,
        contact_number: contactNumber,
        action_note: note,
        action_type: contactType,
      };
      setlog({
        id: id,
        data: payload,
      });
    }
  }, [modalShow]);
  const handleSave = async () => {
    if (!note.trim()) {
      toast.error('Please write what was discussed before saving.');
      return;
    }

    try {
      const payload = {
        status: 'called',
        contact_name: contactName,
        contact_number: contactNumber,
        contact_code: contactCode,
        action_note: note,
        action_type: contactType,
      };
      setlog({
        id: id,
        data: payload,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (contactType == 'device_call' && isSuccess) {
      setModalShow(false);
    }
  }, [isSuccess]);

  const finalPlaceholder =
    placeholder ||
    `e.g. Spoke with ${contactName || 'the contact'}, discussed ${
      contactType || 'the issue'
    }. ETA 7 minutes.`;

  return (
    <div className='w-full border-t border-border pt-4 mt-2 space-y-3 text-left'>
      {/* Only show toggle if autoOpen is false */}
      {!autoOpen && (
        <div className='flex justify-between items-center mb-6'>
          <label className='text-sm font-light text-text/80'>Did you contact {contactType}?</label>

          <div className='flex items-center gap-3 !m-0'>
            <span className={!contacted ? 'font-medium text-red-500' : 'text-text/50'}>No</span>
            <Switch checked={contacted} onCheckedChange={setContacted} disabled={isPending} />
            <span className={contacted ? 'font-medium text-green-600' : 'text-text/50'}>Yes</span>
          </div>
        </div>
      )}

      {/* Message box */}
      {contacted && (
        <>
          {!autoOpen && (
            <label htmlFor='call-note' className='text-sm font-light text-text/80'>
              Please record what was discussed during the call.
            </label>
          )}

          <Textarea
            id='call-note'
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={isPending}
            placeholder={finalPlaceholder}
          />

          <div className='flex justify-end'>
            <Button
              onClick={handleSave}
              disabled={isPending}
              className='bg-red-600 hover:bg-red-700 text-white'
            >
              {isPending ? 'Saving...' : 'Save Call Note'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
