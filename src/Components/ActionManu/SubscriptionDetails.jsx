import { Button, Empty, Modal, Tooltip } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { PiGitMergeBold } from 'react-icons/pi';
import { getSubscriptionDetails } from '../../api/subscriptions';
import { getPaymentMethods } from '../../api/ordersManage';
import { RiSecurePaymentLine } from 'react-icons/ri';
import { Spin } from 'antd';
export default function SubscriptionDetailsModal({ data }) {
  const [isvisible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const onClose = () => {
    setVisible(false);
  };
  const getSubscriptionData = useCallback(() => {
    setLoading(true);
    // getSubscriptionDetails({ id: data?.subscription_id })
    getSubscriptionDetails({ id: data?.subscription_id })
      .then((response) => {
        setSubscriptionDetails(response);
      })
      .catch((error) => {
        console.error('Error fetching subscription details:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [data]);
  const getPaymentMethodList = useCallback(() => {
    getPaymentMethods({ customer_id: subscriptionDetails?.customer })
      .then((response) => {
        setPaymentMethods(response || []);
      })
      .catch((error) => {
        console.error('Error fetching payment methods:', error);
      });
  }, [subscriptionDetails?.customer]);
  useEffect(() => {
    if (isvisible) {
      getSubscriptionData();
    }
  }, [isvisible, getSubscriptionData]);
  useEffect(() => {
    if (subscriptionDetails) {
      getPaymentMethodList();
    }
  }, [subscriptionDetails, getPaymentMethodList]);

  return (
    <div>
      <Button shape='round' icon={<RiSecurePaymentLine />} onClick={() => setVisible(true)}>
        Subscription
      </Button>

      <Modal
        open={isvisible}
        onCancel={onClose}
        footer={null}
        centered
        width='80vw'
        className='device-configuration-modal my-6 lg:max-w-[50vw]'
      >
        {!subscriptionDetails && loading && (
          <Spin className='flex justify-center items-center h-64' />
        )}
        {!subscriptionDetails && !loading && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        {subscriptionDetails && (
          <div className='p-6'>
            <h2 className='text-xl font-semibold mb-4'>Subscription Details</h2>

            <div className='grid grid-cols-2 gap-y-4 gap-x-6'>
              {/* Subscription Name */}
              {/* <div>
              <div className="text-[16px] text-gray-500">Subscription Name</div>
              <div className="text-[20px] text-black font-medium">
                Seenyor Pro
              </div>
            </div> */}
              {/* Subscription Status */}
              <div>
                <div className='text-[16px] text-gray-500'>Subscription Status</div>
                <div
                  className='text-[20px] text-green-600 font-medium capitalize flex items-center gap-2'
                  style={{
                    color:
                      subscriptionDetails?.status === 'active'
                        ? 'green'
                        : subscriptionDetails?.status === 'trialing'
                          ? 'black'
                          : 'red',
                  }}
                >
                  {subscriptionDetails && (
                    <span className='relative flex size-3'>
                      <span
                        className='absolute inline-flex h-full w-full animate-ping rounded-full  opacity-75'
                        style={{
                          backgroundColor:
                            subscriptionDetails?.status === 'active'
                              ? 'green'
                              : subscriptionDetails?.status === 'trialing'
                                ? 'black'
                                : 'red',
                        }}
                      ></span>
                      <span
                        className='relative inline-flex size-3 rounded-full '
                        style={{
                          backgroundColor:
                            subscriptionDetails?.status === 'active'
                              ? 'green'
                              : subscriptionDetails?.status === 'trialing'
                                ? 'black'
                                : 'red',
                        }}
                      ></span>
                    </span>
                  )}

                  {subscriptionDetails?.status || '--'}
                </div>
              </div>
              {/* Amount */}
              <div>
                <div className='text-[16px] text-gray-500'>Amount</div>
                <div className='text-[20px] text-black font-medium'>
                  $ {subscriptionDetails?.plan?.amount / 100}{' '}
                  {subscriptionDetails?.plan?.currency?.toUpperCase()}
                </div>
              </div>

              {/* Recurring Cycle */}
              <div>
                <div className='text-[16px] text-gray-500'>Recurring Cycle</div>
                <div className='text-[20px] text-black font-medium capitalize'>
                  {subscriptionDetails?.plan?.interval || '--'}
                </div>
              </div>

              {/* Next Payment Date */}
              <div>
                <div className='text-[16px] text-gray-500'>Next Payment Date</div>
                <div className='text-[20px] text-black font-medium'>
                  {subscriptionDetails?.current_period_end
                    ? new Date(subscriptionDetails?.current_period_end * 1000).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )
                    : '--'}
                </div>
              </div>

              {/* Default Card */}
              <div className='col-span-2'>
                <div className='text-[16px] text-gray-500 mb-2'>Saved Cards</div>

                <div className='grid md:grid-cols-2 gap-4'>
                  {paymentMethods.map((pm) => {
                    const card = pm.card;
                    const isDefault = pm.isDefault;

                    return (
                      <div
                        key={pm.id}
                        className={`border rounded-xl p-4 flex justify-between items-center shadow-sm ${
                          isDefault ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                        }`}
                      >
                        <div>
                          <div className='text-[14px] text-gray-500'>
                            {card.brand.toUpperCase()}
                          </div>
                          <div className='text-[18px] font-medium'>**** **** **** {card.last4}</div>
                          <div className='text-sm text-gray-500'>
                            Exp: {card.exp_month}/{card.exp_year}
                          </div>
                        </div>

                        {isDefault && (
                          <div className='text-blue-600 text-sm font-medium bg-blue-100 px-3 py-1 rounded-full'>
                            Default
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {paymentMethods.length === 0 && (
                    <div className='text-gray-500 text-sm italic'>No saved cards available.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
