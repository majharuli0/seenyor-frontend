import { useEffect, useState, useRef } from 'react';
import ls from 'store2';
const DetailOfElderly = ({
  menus,
  activeTab,
  setchatData,
  setActiveTab,
  setLoading,
  type,
  handleChange = () => {},
}) => {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const handleEmit = (e, key) => {
    if (setchatData) setchatData({});
    if (setLoading) setLoading(true);
    if (setActiveTab) setActiveTab(e.text);
    ls.session.set('elderlyTab', e.text);
    handleChange({ name: e.text, key, e });
  };
  //make more response the tabs by draging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // *2 to scroll faster
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  return (
    <div
      className='overflow-x-auto cursor-grab'
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{ userSelect: 'none' }} // Disable text selection while dragging
    >
      <div className='flex flex-nowrap gap-3'>
        {menus.map((e, key) => (
          <div
            key={key}
            onClick={() => handleEmit(e, key)}
            className={`
            xl:text-[14px] text-nowrap sm:text-[13px] bg-white text-cblock
            border border-transparent hover:bg-black/10 ${
              activeTab === e.text ? '!bg-cblock hover:text-white' : 'hover:text-cblock'
            }
            border border-transparent relative cursor-pointer h-[40px] mr-[10px] pl-[20px] pr-[20px] rounded-[10px] flex items-center ${
              activeTab === e.text ? 'text-white bg-cblock' : 'text-OnButtonNormal'
            }
          `}
          >
            {e.text}
          </div>
        ))}
      </div>
    </div>
  );
};
export default DetailOfElderly;
