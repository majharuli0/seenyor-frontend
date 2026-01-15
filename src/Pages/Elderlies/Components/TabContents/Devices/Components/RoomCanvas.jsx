import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layer, Line, Stage, Image } from 'react-konva';
import Rectangle from './CanvasObject';
import {
  updateRoomObject,
  getRoomInfo,
  deleteObject,
  addRoomObject,
} from '@/api/deviceConfiguration';
import { Alert, Button, ConfigProvider, Input, Spin, Timeline, Modal } from 'antd';
import { AiTwotoneSave } from 'react-icons/ai';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons';
import { MdOutlineAdd } from 'react-icons/md';
import AddObjectModal from './addObjectModal'; // Import the new component
import deviceImg from '../images/1.png';
import full from '@/assets/icon/room/full.png';
import ObjectRenderer from '@/Components/RoomMap/ObjectTemplate';
import { calculateDimensions } from '@/utils/helper';

const { confirm } = Modal;

const objectLabel = {
  0: { label: 'Invalid Area', icon: 'oth' },
  1: { label: 'Custom Area', icon: 'oth' },
  2: { label: 'Bed', icon: 'bed' },
  3: { label: 'Interference Area', icon: 'oth' },
  4: { label: 'Door', icon: 'door' },
  5: { label: 'Sofa', icon: 'sofa' },
  6: { label: 'Table', icon: 'table' },
  7: { label: 'Tub', icon: 'tub' },
  8: { label: 'Bathroom', icon: 'bathroom' },
};

const RoomCanvas = ({ device_id, elderly_id, mountType = 'ceiling', roomType = 'bedroom' }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [tempObjectId, setTempObjectId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deviceIcon, setDeviceIcon] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [boundary, setBoundary] = useState({
    up_left: [0, 0],
    low_left: [0, 0],
    up_right: [0, 0],
    low_right: [0, 0],
  });

  const width = 600 + 100;
  const height = 400 + 100;
  const centerX = width / 2;
  const centerY = mountType === 'ceiling' ? height / 2 : 0;
  const scale = 10;
  const canvasCenter = {
    x: 35 * scale,
    y: mountType === 'ceiling' ? 25 * scale : 0,
  };

  const getRoomInformation = useCallback(() => {
    getRoomInfo({ room_id: device_id, elderly_id: elderly_id })
      .then((roomInfo) => {
        setRoomInfo(roomInfo.data);
      })
      .catch((error) => console.log(error));
  }, [device_id, elderly_id]);

  useEffect(() => {
    getRoomInformation();
  }, [getRoomInformation]);

  const convertCoords = (coords = [0, 0]) => {
    if (!Array.isArray(coords) || coords.length < 2) {
      throw new Error('Invalid input: coords must be an array with at least two elements.');
    }
    const [x = 0, y = 0] = coords;
    return [canvasCenter.x - x * scale, canvasCenter.y + y * scale];
  };

  const [objectData, setObjectData] = useState(() => {
    const savedData = localStorage.getItem('canvasObjects');
    return savedData ? JSON.parse(savedData) : roomInfo?.device_areas || [];
  });

  const boundaryPoints = [
    ...convertCoords(boundary.up_left),
    ...convertCoords(boundary.low_left),
    ...convertCoords(boundary.low_right),
    ...convertCoords(boundary.up_right),
  ];

  const generateGridLines = (points) => {
    const lines = [];
    const [minX, maxX, minY, maxY] = [
      Math.min(...points.filter((_, i) => i % 2 === 0)),
      Math.max(...points.filter((_, i) => i % 2 === 0)),
      Math.min(...points.filter((_, i) => i % 2 !== 0)),
      Math.max(...points.filter((_, i) => i % 2 !== 0)),
    ];
    for (let y = minY + 10; y < maxY; y += 50) {
      lines.push([minX, y, maxX, y]);
    }
    for (let x = minX + 10; x < maxX; x += 50) {
      lines.push([x, minY, x, maxY]);
    }
    return lines;
  };

  useEffect(() => {
    if (roomInfo?.device_boundaries && typeof roomInfo.device_boundaries === 'object') {
      const area = Object.fromEntries(
        Object.entries(roomInfo.device_boundaries).reduce((acc, [key, value]) => {
          if (key === '_id') return acc;
          acc.push([key, value.split(',').map(Number)]);
          return acc;
        }, [])
      );
      setBoundary(area);
    } else {
      console.error('device_boundaries is undefined or not an object');
      setBoundary({});
    }

    const img = new window.Image();
    img.src = deviceImg;
    img.onload = () => {
      setDeviceIcon(img);
    };
  }, [roomInfo]);

  useEffect(() => {
    if (roomInfo?.device_areas) {
      setObjectData(roomInfo.device_areas);
    }
  }, [roomInfo]);

  useEffect(() => {
    if (selectedIndex !== null && selectedIndex >= objectData.length) {
      setSelectedIndex(null);
      setOriginalData(null);
    }
  }, [objectData.length, selectedIndex]);

  useEffect(() => {
    localStorage.setItem('canvasObjects', JSON.stringify(objectData));
  }, [objectData]);

  const handleObjectUpdate = (index, newData) => {
    setObjectData((prev) => {
      const newState = prev.map((item, i) => (i === index ? { ...item, ...newData } : item));
      setHasUnsavedChanges(JSON.stringify(newState[index]) !== JSON.stringify(originalData));
      return newState;
    });
  };

  const handleSelect = async (newIndex) => {
    if (selectedIndex !== null && selectedIndex !== newIndex && hasUnsavedChanges) {
      const confirmation = await showConfirm({
        oktext: 'Save Changes',
        canceltext: 'Discard Changes',
        titles: 'Save Changes!',
        description:
          'Please save changes after making any new changes or discard changes to proceed.',
      });
      if (confirmation) {
        await saveChanges();
      } else {
        revertChanges();
      }
    }
    setSelectedIndex(newIndex);
    setOriginalData(objectData[newIndex]);
    setHasUnsavedChanges(false);
  };

  const revertChanges = (forceRemoveTemp = false) => {
    if (selectedIndex === null) return;
    setObjectData((prev) => {
      const currentObj = prev[selectedIndex];
      const isTemp = currentObj?._id === tempObjectId;
      if (isTemp || forceRemoveTemp) {
        setTempObjectId(null);
        return prev.filter((_, i) => i !== selectedIndex);
      }
      const newData = [...prev];
      newData[selectedIndex] = originalData;
      return newData;
    });
    setHasUnsavedChanges(false);
    setSelectedIndex(null);
    setOriginalData(null);
  };

  const getAvailableCoordKey = () => {
    const usedKeys = new Set(
      objectData
        .map((obj) => parseInt(obj.coordKey, 10))
        .filter((k) => !isNaN(k) && k >= 0 && k <= 15)
    );
    for (let i = 0; i <= 15; i++) {
      if (!usedKeys.has(i)) return i;
    }
    return null;
  };

  const createNewObject = (template) => {
    const coordKey = getAvailableCoordKey();
    if (coordKey === null) {
      alert('Maximum 16 objects allowed (coordKey 0-15). Delete some objects first.');
      return null;
    }
    const { type, width, length, label, object_type } = template;
    const halfWidth = width / 2;
    const halfLength = length / 2;
    return {
      _id: `temp-${Date.now()}`,
      type: type,
      width: width,
      length: length,
      label: label,
      up_left: `${-halfWidth},${halfLength}`,
      up_right: `${halfWidth},${halfLength}`,
      low_left: `${-halfWidth},${-halfLength}`,
      low_right: `${halfWidth},${-halfLength}`,
      object_type: object_type,
      coordKey: coordKey.toString(),
    };
  };

  const handleAddObject = async () => {
    if (tempObjectId) {
      showConfirm({
        oktext: 'Ok',
        titles: 'Action Required!',
        description: 'To proceed, please remove the existing object or save it first.',
        canceltext: ' ',
      });
      return;
    }
    if (hasUnsavedChanges) {
      const confirmation = await showConfirm({
        oktext: 'Save Changes',
        canceltext: 'Discard Changes',
        titles: 'Save Changes!',
        description:
          'Please save changes after making any new changes or discard changes to proceed.',
      });
      if (confirmation) {
        try {
          await saveChanges();
        } catch (error) {
          return;
        }
      } else {
        revertChanges(true);
      }
    }
    setIsModalVisible(true);
  };

  const handleModalOk = (template) => {
    console.log(template);

    const newObject = createNewObject(template);
    if (newObject) {
      setObjectData((prev) => {
        const newData = [...prev, newObject];
        setTempObjectId(newObject._id);
        setSelectedIndex(newData.length - 1); // Automatically select the new object
        setOriginalData(newObject);
        setHasUnsavedChanges(true);
        return newData;
      });
    }
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const saveChanges = async () => {
    if (!hasActualChanges) return;
    try {
      setSaving(true);
      await saveToAPI(objectData[selectedIndex]);
      setOriginalData(objectData[selectedIndex]);
      setHasUnsavedChanges(false);
    } catch (error) {
      alert('Save failed! Changes not preserved.');
    } finally {
      setSaving(false);
    }
  };

  const saveToAPI = async (obj) => {
    const isNewObject = obj._id.startsWith('temp-');
    const apiPayload = {
      elderly_id: elderly_id,
      room_id: roomInfo._id,
      obj: {
        coordKey: obj.coordKey,
        type: obj.type,
        uid: roomInfo?.device_no,
        lowLeft: obj.low_left,
        upLeft: obj.up_left,
        upRight: obj.up_right,
        lowRight: obj.low_right,
        length: obj.length,
        width: obj.width,
        object_type: obj.object_type,
      },
    };
    if (isNewObject) {
      await addRoomObject(apiPayload)
        .then(() => {
          getRoomInformation();
          setTempObjectId(null);
        })
        .catch((err) => {
          console.error('Error saving changes:', err);
          getRoomInformation();
        });
    } else {
      await updateRoomObject({ ...apiPayload, obj_id: obj._id })
        .then(() => {
          getRoomInformation();
        })
        .catch((err) => {
          console.error('Error saving changes:', err);
          getRoomInformation();
        });
    }
  };

  const handleDeleteObject = async (obj) => {
    if (obj._id === tempObjectId) {
      setObjectData((prev) => prev.filter((item) => item._id !== tempObjectId));
      setTempObjectId(null);
      setHasUnsavedChanges(false);
      setSelectedIndex(null);
      setDeleting(false);
      return;
    }
    if (selectedIndex === null || (await showConfirm({ oktext: 'Delete', canceltext: 'Cancel' }))) {
      setDeleting(true);
      deleteObject({
        elderly_id: elderly_id,
        room_id: roomInfo._id,
        obj_id: obj._id,
      })
        .then(() => {
          getRoomInformation();
          setSelectedIndex(null);
          setOriginalData(null);
        })
        .catch((err) => {
          console.error('Error deleting object:', err);
        })
        .finally(() => setDeleting(false));
    }
  };

  const hasActualChanges = useMemo(() => {
    if (!roomInfo?.device_areas) return false;
    return JSON.stringify(objectData) !== JSON.stringify(roomInfo.device_areas);
  }, [objectData, roomInfo?.device_areas]);

  const handleDimensionChange = (type, value) => {
    if (selectedIndex === null) return;
    const numericValue = parseInt(value) / 10 || 0;
    const selectedObj = objectData[selectedIndex];
    let newData = {};

    if (type === 'width') {
      const up_left = selectedObj.up_left.split(',').map(Number);
      const up_right = selectedObj.up_right.split(',').map(Number);
      const centerX = (up_right[0] + up_left[0]) / 2;
      const newLeft = centerX - numericValue / 2;
      const newRight = centerX + numericValue / 2;
      newData = {
        width: numericValue,
        up_left: `${Math.round(newLeft)},${up_left[1]}`,
        up_right: `${Math.round(newRight)},${up_right[1]}`,
        low_left: `${Math.round(newLeft)},${selectedObj.low_left.split(',')[1]}`,
        low_right: `${Math.round(newRight)},${selectedObj.low_right.split(',')[1]}`,
      };
    } else {
      const up_left = selectedObj.up_left.split(',').map(Number);
      const low_left = selectedObj.low_left.split(',').map(Number);
      const centerY = (up_left[1] + low_left[1]) / 2;
      const newTop = centerY + numericValue / 2;
      const newBottom = centerY - numericValue / 2;
      newData = {
        length: numericValue,
        up_left: `${up_left[0]},${Math.round(newTop)}`,
        up_right: `${selectedObj.up_right.split(',')[0]},${Math.round(newTop)}`,
        low_left: `${low_left[0]},${Math.round(newBottom)}`,
        low_right: `${selectedObj.low_right.split(',')[0]},${Math.round(newBottom)}`,
      };
    }
    handleObjectUpdate(selectedIndex, newData);
  };

  const handlePositionAdjust = (direction) => {
    if (selectedIndex === null) return;
    const selectedObj = objectData[selectedIndex];
    const deltaX = direction === 'left' ? 1 : direction === 'right' ? -1 : 0;
    const deltaY = direction === 'up' ? -1 : direction === 'down' ? 1 : 0;
    const adjustCoordinate = (coord) => {
      const [x, y] = coord.split(',').map(Number);
      return `${x + deltaX},${y + deltaY}`;
    };
    const newData = {
      up_left: adjustCoordinate(selectedObj.up_left),
      up_right: adjustCoordinate(selectedObj.up_right),
      low_left: adjustCoordinate(selectedObj.low_left),
      low_right: adjustCoordinate(selectedObj.low_right),
    };
    handleObjectUpdate(selectedIndex, newData);
  };

  const showConfirm = ({
    oktext = 'Confirm',
    canceltext = 'Cancel',
    titles = 'Delete Object!',
    description = 'Are you sure you want to delete this item?',
  }) => {
    return new Promise((resolve) => {
      confirm({
        title: titles,
        icon: <ExclamationCircleFilled />,
        content: description,
        className: 'mini-modal',
        centered: true,
        okText: oktext,
        cancelText: canceltext,
        okButtonProps: {
          style: {
            backgroundColor: oktext === 'Delete' ? '#ff4d4f' : '#1B2559',
            color: 'white',
          },
        },
        cancelButtonProps: {
          style: {
            backgroundColor: canceltext === 'Discard Changes' ? '#ff4d4f' : '#FAFAFA',
            border: 'none',
            color: canceltext === 'Discard Changes' ? '#fff' : '#1B2559',
          },
        },
        onOk() {
          resolve(true);
        },
        onCancel() {
          resolve(false);
        },
      });
    });
  };

  return (
    <Spin
      tip='Loading Objects...'
      spinning={!roomInfo?.device_areas && !roomInfo?.device_boundaries}
    >
      <div className='flex flex-col w-full h-full'>
        <div className='border-b border-b-slate-200 p-2 py-4'>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#1B2559',
              },
            }}
          >
            <div className='w-full flex items-center justify-between'>
              <div>
                <Alert
                  message={
                    mountType === 'ceiling'
                      ? 'Click or drag to edit the area!'
                      : 'Click or drag to draw the area, click to edit the area, double-click to delete the area'
                  }
                  type='info'
                  showIcon
                />
              </div>
              <div className='flex items-center justify-center gap-4'>
                <div className='flex items-center gap-2'>
                  {/* <h3 className="text-lg font-semibold">Add Object:</h3> */}
                  {hasActualChanges ? (
                    <Button
                      onClick={saveChanges}
                      disabled={!hasActualChanges}
                      variant='solid'
                      color='default'
                      icon={<AiTwotoneSave />}
                      loading={saving}
                      size='large'
                    >
                      {hasActualChanges ? 'Save Changes' : 'No Changes'}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleAddObject}
                      size='large'
                      variant='solid'
                      color='default'
                      disabled={saving}
                      icon={<MdOutlineAdd />}
                    >
                      Add Object
                    </Button>
                  )}
                </div>
                {/* <Button
                  onClick={saveChanges}
                  disabled={!hasActualChanges}
                  variant="solid"
                  color="default"
                  icon={<AiTwotoneSave />}
                  loading={saving}
                  size="large"
                >
                  {hasActualChanges ? "Save Changes" : "No Changes"}
                </Button> */}
              </div>
            </div>
          </ConfigProvider>
        </div>
        <div className='flex items-start w-full h-full gap-4'>
          <div className='w-[70%] h-full flex items-center justify-center border-r border-r-slate-200 py-4'>
            <Stage width={width} height={height} style={{ background: '#F9F9F9' }}>
              <Layer>
                <Line
                  points={[centerX, 0, centerX, 500]}
                  stroke='black'
                  strokeWidth={2}
                  opacity={0.1}
                />
                <Line
                  points={[0, centerY, 700, centerY]}
                  stroke='black'
                  strokeWidth={2}
                  opacity={0.1}
                />
                <Line
                  points={boundaryPoints}
                  closed
                  stroke='rgba(250, 181, 21, 1)'
                  strokeWidth={2}
                  dash={[10, 5]}
                  fill='#FFFFFF'
                />
                {generateGridLines(boundaryPoints).map((gridLine, index) => (
                  <Line
                    key={index}
                    points={gridLine}
                    stroke='rgba(250, 181, 21, 1)'
                    strokeWidth={1}
                    dash={[2, 3]}
                  />
                ))}
              </Layer>

              {objectData?.map((item, i) => (
                <Rectangle
                  key={item._id || i}
                  objectData={item}
                  roomType={roomInfo?.room_type}
                  scale={scale}
                  centerX={centerX}
                  centerY={centerY}
                  onUpdate={(newData) => handleObjectUpdate(i, newData)}
                  isSelected={selectedIndex === i}
                  onSelect={() => handleSelect(i)}
                />
              ))}
              <Layer>
                {deviceIcon && (
                  <Image
                    image={deviceIcon}
                    x={canvasCenter.x - 50 / 2}
                    y={canvasCenter.y - 50 / 2}
                    width={50}
                    height={50}
                  />
                )}
              </Layer>
            </Stage>
          </div>
          <div className='w-[30%] py-4 h-full'>
            <Timeline
              items={[
                {
                  children: (
                    <>
                      <h2 className='font-medium text-lg mb-2'>Object Info</h2>
                      <p className='text-base'>
                        Type:{' '}
                        <span className='font-medium ml-2'>{objectData[selectedIndex]?.type}</span>
                      </p>
                    </>
                  ),
                },
                {
                  children: (
                    <>
                      <h2 className='font-medium text-lg mb-2'>Adjust Object Size</h2>
                      <div className='flex items-center gap-3 flex-col'>
                        <Input
                          type='number'
                          value={
                            objectData[selectedIndex]?.width * 10 ||
                            (objectData[selectedIndex] &&
                              calculateDimensions(objectData[selectedIndex])?.width) ||
                            0
                          }
                          onChange={(e) => handleDimensionChange('width', e.target.value)}
                          min={1}
                          max={mountType === 'ceiling' ? 600 : 60}
                          size='large'
                          addonBefore='Width (CM)'
                          disabled={!objectData[selectedIndex]}
                        />
                        <Input
                          type='number'
                          value={
                            objectData[selectedIndex]?.length * 10 ||
                            (objectData[selectedIndex] &&
                              calculateDimensions(objectData[selectedIndex])?.length) ||
                            0
                          }
                          onChange={(e) => handleDimensionChange('length', e.target.value)}
                          min={1}
                          max={mountType === 'ceiling' ? 400 : 40}
                          size='large'
                          addonBefore='Length (CM)'
                          disabled={!objectData[selectedIndex]}
                        />
                      </div>
                    </>
                  ),
                },
                {
                  children: (
                    <>
                      <h2 className='font-medium text-lg mb-2'>Adjust Position</h2>
                      <div className='flex flex-col items-center gap-2'>
                        <Button
                          icon={<ArrowUpOutlined />}
                          onClick={() => handlePositionAdjust('up')}
                          disabled={!objectData[selectedIndex]}
                          className='flex items-center justify-center'
                        />
                        <div className='flex gap-10'>
                          <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => handlePositionAdjust('left')}
                            disabled={!objectData[selectedIndex]}
                          />
                          <Button
                            icon={<ArrowRightOutlined />}
                            onClick={() => handlePositionAdjust('right')}
                            disabled={!objectData[selectedIndex]}
                          />
                        </div>
                        <Button
                          icon={<ArrowDownOutlined />}
                          onClick={() => handlePositionAdjust('down')}
                          disabled={!objectData[selectedIndex]}
                        />
                        <p className='text-sm text-gray-500 mt-2'>
                          Adjust by {mountType === 'ceiling' ? '100 centimeters' : '1 decimeter'}{' '}
                          per click
                        </p>
                      </div>
                    </>
                  ),
                },
                {
                  color: 'red',
                  children: (
                    <>
                      <h2 className='font-medium text-lg mb-2'>Delete Object</h2>
                      <Button
                        onClick={() => handleDeleteObject(objectData[selectedIndex])}
                        disabled={!objectData[selectedIndex]}
                        className='w-full'
                        size='large'
                        color='danger'
                        variant='dashed'
                        loading={deleting}
                      >
                        Delete
                      </Button>
                    </>
                  ),
                },
              ]}
            />
          </div>
        </div>

        <AddObjectModal
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          roomType={roomType}
          mountType={mountType}
        />
      </div>
    </Spin>
  );
};

export default RoomCanvas;
