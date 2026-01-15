import { useState, useContext } from 'react';
import { Checkbox } from 'antd';
import CustomModal from '@/Shared/modal/CustomModal';
import { MdInfo } from 'react-icons/md';
import CustomInput from '@/Shared/input/CustomInput';
import { RiRefund2Line } from 'react-icons/ri';
import { refundRequest } from '@/api/ordersManage';
import { SidebarContext } from '@/Context/CustomUsertable';
import toast from 'react-hot-toast';
export default function RefundsRequestModal({ record }) {
  const [open, setOpen] = useState(false);
  const onCancel = () => setOpen(false);
  const [customAmountEnabled, setCustomAmountEnabled] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [amount, setAmount] = useState(record.total);
  const [error, setError] = useState('');
  const sharedMethod = useContext(SidebarContext);

  console.log(record);
  const handleSubmit = (e) => {
    e.preventDefault();
    let amountToRefund;
    if (customAmountEnabled) {
      amountToRefund = customAmount;
    } else {
      amountToRefund = amount;
    }
    console.log(amountToRefund);
    refundRequest(record?.transaction_id, { amount: Number(amountToRefund) })
      .then((res) => {
        console.log(res);
        setOpen(false);
        sharedMethod.getList();
        toast.success('Refund request sent successfully');
      })
      .catch((err) => {
        console.log(err);
        toast.error('Something went wrong, Please try again or Try From Stripe Dashboard');
      });
  };
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className='flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg hover:text-primary'
      >
        <RiRefund2Line size={25} />
        <span className='text-base font-medium'>Refund</span>
      </button>
      <CustomModal
        modalOPen={open}
        setModalOpen={setOpen}
        onclose={onCancel}
        buttonText='Confirm Refund'
        handleSubmit={handleSubmit}
        title='Refund'
      >
        <div>
          <div
            id='note'
            className='text-yellow-600 bg-yellow-50/50 rounded-lg p-3 flex flex-col items-start gap-2'
          >
            <MdInfo className='text-yellow-600 text-2xl' />
            <p className='text-[14px] xl:text-base font-normal  '>
              Refunds can take <b>up to 10 business days</b> to appear in a customer&apos;s account.
              You can check the status of a refund on the Transaction page or the Payments tab of
              The Stripe Dashboard.
            </p>
          </div>
          <ul className='list-none list-inside flex flex-col gap-2 mt-3'>
            <li className='text-[16px] xl:text-base font-normal flex items-center gap-2'>
              Transaction ID: <span className='font-bold'>{record.transaction_id}</span>
            </li>
            <li className='text-[16px] xl:text-base font-normal flex items-center gap-2'>
              Amount: <span className='font-bold'>${record.total}</span>
              <Checkbox
                checked={customAmountEnabled}
                onChange={() => setCustomAmountEnabled(!customAmountEnabled)}
              >
                Custom amount
              </Checkbox>
            </li>
          </ul>
          <div className='flex flex-col gap-2'>
            <CustomInput
              placeholder='Enter custom amount'
              type='number'
              //   step="0.01"
              disabled={!customAmountEnabled}
              register={{
                value: customAmount,
                onChange: (e) => {
                  const value = e.target.value;
                  const parsedValue = parseFloat(value);

                  if (value === '' || parsedValue <= record.total) {
                    setCustomAmount(value);
                    setError(''); // Clear error if valid
                  } else {
                    setError('Custom amount must be less than or equal to the total amount.');
                  }
                },
              }}
              error={{ type: 'required', message: error }}
            />
          </div>
        </div>
      </CustomModal>
    </>
  );
}
