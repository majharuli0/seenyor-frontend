import React, { useRef, useState, useEffect } from 'react';
import { Layer, Line, Text, Image, Rect, Group, Circle } from 'react-konva';

import bedroomOther from '@/assets/icon/object/bo.svg';
import bathroomOther from '@/assets/icon/object/bao.svg';
import livingroomOther from '@/assets/icon/object/lo.svg';
import singleBed from '@/assets/icon/object/sb.svg';
import doubleBed from '@/assets/icon/object/db.svg';
import door from '@/assets/icon/object/do.svg';
import sofa from '@/assets/icon/object/sofa.svg';
import table from '@/assets/icon/object/t.svg';
import tub from '@/assets/icon/object/tu.svg';
import toilet from '@/assets/icon/object/to.svg';
import oth from '@/assets/icon/room/oth.png';

// Object styling based on type
const objectStyles = {
  0: { fill: 'black', label: 'Invalid Area', stroke: 'darkred', icon: 'oth' },
  1: { fill: 'black', label: 'Custom Area', stroke: 'black', icon: 'oth' },
  2: { fill: 'black', label: 'Bed', stroke: 'darkblue', icon: 'bed' },
  3: {
    fill: 'black',
    label: 'Interference Area',
    stroke: 'darkorange',
    icon: 'oth',
  },
  4: { fill: 'black', label: 'Door', stroke: 'darkgreen', icon: 'door' },
  5: {
    fill: 'black',
    label: 'Monitoring Bed',
    stroke: 'darkpurple',
    icon: 'bed',
  },
};
import {
  FaBed,
  FaCouch,
  FaDoorOpen,
  FaBath,
  FaTable,
  FaArrowsAltH,
  FaArrowsAltV,
} from 'react-icons/fa';
import { MdTableBar } from 'react-icons/md';
import { PiToiletFill } from 'react-icons/pi';
const objectTemplates = {
  2: [
    {
      type: 2,
      label: 'Bed',
      width: 18,
      length: 8,
      fill: 'black',
      stroke: 'gray',
      icon: singleBed,
      object_type: 5,
    },
    {
      type: 2,
      label: 'Bed',
      width: 18,
      length: 8,
      fill: 'black',
      stroke: 'gray',
      icon: singleBed,
      object_type: 6,
    },
    {
      type: 5,
      label: 'Monitoring Bed',
      width: 18,
      fill: 'black',
      stroke: 'gray',
      length: 13,
      icon: singleBed,
      object_type: 7,
    },
    {
      type: 4,
      label: 'Door',
      width: 10,
      fill: 'black',
      stroke: 'gray',
      length: 3,
      icon: door,
      object_type: 4,
    },
    {
      type: 1,
      label: 'Others',
      width: 10,
      length: 10,
      icon: bedroomOther,
      fill: 'black',
      stroke: 'gray',
      object_type: 12,
    },
    {
      type: 3,
      label: 'Others',
      width: 10,
      length: 10,
      icon: bedroomOther,
      fill: 'black',
      stroke: 'gray',
    },
  ],
  1: [
    {
      type: 5,
      label: 'Sofa',
      width: 10,
      fill: 'black',
      stroke: 'gray',
      length: 10,
      icon: sofa,
      object_type: 8,
    },
    {
      type: 6,
      label: 'Table',
      width: 10,
      fill: 'black',
      stroke: 'gray',
      length: 10,
      icon: table,
      object_type: 9,
    },
    {
      type: 4,
      label: 'Door',
      width: 10,
      length: 3,
      fill: 'black',
      stroke: 'gray',
      icon: door,
      object_type: 4,
    },
    {
      type: 1,
      label: 'Others',
      width: 10,
      fill: 'black',
      stroke: 'gray',
      length: 10,
      icon: livingroomOther,
      object_type: 13,
    },
  ],
  3: [
    {
      type: 7,
      label: 'Tub',
      width: 15,
      length: 7.5,
      fill: 'black',
      stroke: 'gray',
      icon: tub,
      object_type: 10,
    },
    {
      type: 8,
      label: 'Toilet',
      width: 6,
      length: 6,
      fill: 'black',
      stroke: 'gray',
      icon: toilet,
      object_type: 11,
    },
    {
      type: 4,
      label: 'Door',
      width: 10,
      length: 3,
      fill: 'black',
      stroke: 'gray',
      icon: door,
      object_type: 4,
    },
    {
      type: 1,
      label: 'Others',
      width: 10,
      length: 10,
      fill: 'black',
      stroke: 'gray',
      icon: bathroomOther,
      object_type: 14,
    },
  ],
};
const Rectangle = ({
  objectData,
  scale,
  centerX,
  centerY,
  onUpdate,
  isSelected,
  onSelect,
  roomType,
}) => {
  const initialDragData = useRef(null);
  const [iconImage, setIconImage] = useState(null);
  const [textWidth, setTextWidth] = useState(0);
  const [textHeight, setTextHeight] = useState(0);
  const [iconWidth, setIconWidth] = useState(0);
  const [iconHeight, setIconHeight] = useState(0);
  const [objMapping, setObjMapping] = useState({
    type: 1,
    width: 10,
    length: 10,
    icon: null,
    fill: 'black',
    stroke: 'gray',
    label: 'Others',
    object_type: 14,
  });
  const textRef = useRef();
  const iconRef = useRef();

  // Set text width and height once the component is mounted
  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.getWidth());
      setTextHeight(textRef.current.getHeight());
    }

    // Dynamically load the icon image
    const img = new window.Image();
    img.src = objMapping.icon;

    img.onload = () => {
      setIconImage(img);
      setIconWidth(40);
      setIconHeight(40);
    };
  }, [objMapping.icon]);

  // Convert coordinates to pixel values
  const convertCoords = (coords = [0, 0]) => {
    const [x = 0, y = 0] = coords;
    return [centerX - x * scale, centerY + y * scale];
  };

  // Generate points for the rectangle
  const objPoints = [
    ...convertCoords(objectData.up_left.split(',').map(Number)),
    ...convertCoords(objectData.low_left.split(',').map(Number)),
    ...convertCoords(objectData.low_right.split(',').map(Number)),
    ...convertCoords([
      objectData.low_right.split(',').map(Number)[0],
      objectData.up_right.split(',').map(Number)[1],
    ]),
  ];
  //[low_right[0], up_right[1]]

  // Get the center of the polygon (center of the object)
  const getCenter = (points) => {
    const x = (points[0] + points[2] + points[4] + points[6]) / 4;
    const y = (points[1] + points[3] + points[5] + points[7]) / 4;
    return { x, y };
  };

  // Calculate the center of the polygon
  const { x: centerXPolygon, y: centerYPolygon } = getCenter(objPoints);

  const handleDragStart = (e) => {
    if (!isSelected) {
      onSelect();
    }
    initialDragData.current = objectData;
  };

  const handleDragMove = (e) => {
    if (!isSelected || !initialDragData.current) return;

    const node = e.target;
    const dx = node.x();
    const dy = node.y();

    const deltaX = Math.round(-dx / scale);
    const deltaY = Math.round(dy / scale);

    if (deltaX === 0 && deltaY === 0) return;

    const updateCoord = (coord) => {
      const [x, y] = coord.split(',').map(Number);
      return `${x + deltaX},${y + deltaY}`;
    };

    const newData = {
      ...initialDragData.current,
      up_left: updateCoord(initialDragData.current.up_left),
      low_left: updateCoord(initialDragData.current.low_left),
      up_right: updateCoord(initialDragData.current.up_right),
      low_right: updateCoord(initialDragData.current.low_right),
    };

    onUpdate(newData); // Use the passed update function
    node.x(0);
    node.y(0);
  };
  useEffect(() => {
    if (roomType) {
      objectTemplates[roomType]?.filter((item) => {
        if (item?.object_type == (objectData?.object_type || objectData?.type)) {
          setObjMapping(item);
        } else if (item?.type == objectData?.type) {
          setObjMapping(item);
        }
      });
    }
  }, [objectData, roomType]);

  return (
    <Layer>
      {/* Create a group for the object */}
      <Group
        draggable
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onClick={onSelect}
        onTap={onSelect}
      >
        {/* Polygon */}
        <Line
          points={objPoints}
          closed
          fill={isSelected ? 'rgba(0,0,0,0.4)' : objMapping.fill}
          stroke={isSelected ? 'black' : ''}
          strokeWidth={isSelected ? 2 : 0}
          // hitStrokeWidth={20}
        />

        {/* Render the icon once the image is loaded */}
        {iconImage && (
          <Image
            ref={iconRef}
            image={iconImage} // Pass the loaded image to the Image component
            x={centerXPolygon - iconWidth / 2} // Center the icon horizontally relative to the group
            y={centerYPolygon - iconHeight / 2} // Center the icon vertically relative to the group
            width={iconWidth}
            height={iconHeight}
          />
        )}

        {/* Render text at the center of the polygon */}
        <Rect
          x={centerXPolygon - textWidth / 2 - 5} // Add padding for the background
          y={centerYPolygon - (textHeight + 60) / 2 - 5} // Match the text position and add padding
          width={textWidth + 10} // Add horizontal padding
          height={textHeight + 10} // Add vertical padding
          fill='rgba(0, 0, 0, 0.7)' // Background color with transparency
          cornerRadius={4} // Optional: Rounded corners
        />
        <Text
          ref={textRef}
          text={objectData?.label || objMapping.label}
          fontSize={14}
          fontStyle='bold'
          fill='white'
          x={centerXPolygon - textWidth / 2} // Center the text horizontally relative to the group
          y={centerYPolygon - (textHeight + 60) / 2} // Center the text vertically relative to the group
        />
      </Group>
    </Layer>
  );
};

export default Rectangle;
