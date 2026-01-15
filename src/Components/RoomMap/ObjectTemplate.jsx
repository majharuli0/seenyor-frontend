import React, { useEffect, useRef, useState } from 'react';
import { Layer, Group, Line, Rect, Text, Image } from 'react-konva';
import bed from '../../assets/icon/room/bed.png';
import door from '../../assets/icon/room/door.png';
import oth from '../../assets/icon/room/oth.png';
import bedroomOther from '@/assets/icon/object/bo.svg';
import bathroomOther from '@/assets/icon/object/bao.svg';
import livingroomOther from '@/assets/icon/object/lo.svg';
import singleBed from '@/assets/icon/object/sb.svg';
import doubleBed from '@/assets/icon/object/db.svg';
import sofa from '@/assets/icon/object/sofa.svg';
import table from '@/assets/icon/object/t.svg';
import tub from '@/assets/icon/object/tu.svg';
import toilet from '@/assets/icon/object/to.svg';

const ObjectRenderer = ({ object = [], convertCoords, roomType }) => {
  const { object_type, type, up_left, low_left, up_right, low_right } = object;
  // Convert points for the object shape
  const objPoints = [
    ...convertCoords(up_left),
    ...convertCoords(low_left),
    ...convertCoords(low_right),
    ...convertCoords([low_right[0], up_right[1]]),
  ];

  // Object styling based on type
  const objectTemplates = {
    2: [
      {
        type: 2,
        label: ' Bed',
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
  const style = objectTemplates[object_type] || {
    fill: 'lightgray',
    label: 'Unknown',
    stroke: 'gray',
  };

  const textRef = useRef();
  const iconRef = useRef();
  const [textWidth, setTextWidth] = useState(0);
  const [textHeight, setTextHeight] = useState(0);
  const [iconWidth, setIconWidth] = useState(0);
  const [iconHeight, setIconHeight] = useState(0);
  const [iconImage, setIconImage] = useState(null);

  // Set text width and height once the component is mounted
  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.getWidth());
      setTextHeight(textRef.current.getHeight());
    }

    // Dynamically load the icon image
    const img = new window.Image();
    img.src = objMapping.icon ? objMapping.icon : oth;

    img.onload = () => {
      setIconImage(img);
      setIconWidth(40);
      setIconHeight(40);
    };
  }, [objMapping.icon]);

  // Calculate the center of the polygon (bounding box center)
  const calculateCenter = (points) => {
    let minX = Math.min(...points.filter((_, index) => index % 2 === 0));
    let maxX = Math.max(...points.filter((_, index) => index % 2 === 0));
    let minY = Math.min(...points.filter((_, index) => index % 2 !== 0));
    let maxY = Math.max(...points.filter((_, index) => index % 2 !== 0));

    return [(minX + maxX) / 2, (minY + maxY) / 2];
  };

  const [centerX, centerY] = calculateCenter(objPoints);
  useEffect(() => {
    if (roomType) {
      objectTemplates[roomType]?.filter((item) => {
        if (item?.object_type == (object?.object_type || object?.type)) {
          setObjMapping(item);
        } else if (item?.type == object?.type) {
          setObjMapping(item);
        }
      });
    }
  }, [object]);
  return (
    <>
      <Line points={objPoints} closed fill={objMapping.fill} strokeWidth={2} />
      {/* Render the icon once the image is loaded */}
      {iconImage && (
        <Image
          ref={iconRef}
          image={iconImage}
          x={centerX - 40 / 2}
          y={centerY - 40 / 2}
          width={40}
          height={40}
        />
      )}
      {/* Render text at the center of the polygon */}
      <Rect
        x={centerX - textWidth / 2 - 5}
        y={centerY - (textHeight + 60) / 2 - 5}
        width={textWidth + 10}
        height={textHeight + 10}
        fill='rgba(0, 0, 0, 0.7)'
        cornerRadius={4}
      />
      <Text
        ref={textRef}
        text={objMapping.label}
        fontSize={14}
        fontStyle='bold'
        fill='white'
        x={centerX - textWidth / 2}
        y={centerY - (textHeight + 60) / 2}
      />
    </>
  );
};

export default ObjectRenderer;
