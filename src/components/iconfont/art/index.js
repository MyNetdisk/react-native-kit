/* eslint-disable no-plusplus */
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ART, Platform, View, AppState, ScrollView } from 'react-native';
import DefaultSvgs from './defaultSvg';

const ReactNativeVersion = require('react-native/Libraries/Core/ReactNativeVersion');

const { Surface, Shape } = ART;
let ShapeKey = 0;

export class IconSVG extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentAppState: true,
    };
  }
  componentDidMount() {
    AppState.addEventListener('change', this._setAppState);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._setAppState);
  }
  _setAppState = nextAppState => {
    if (Platform.OS === 'ios') return;
    this.setState({
      currentAppState: nextAppState,
    });
  };
  render() {
    const { props } = this;
    if (!props.d) return null;

    let d = [];
    if (typeof props.d === 'string') {
      d = [props.d];
    } else {
      d = props.d;
    }
    const count = d.length;
    if (count === 0) return null;

    const { width, height } = props;
    const offset = props.spaceOffset;

    const ShapeProps = {
      x: props.x,
      y: props.y,
      scaleX: props.scaleX || props.scale,
      scaleY: props.scaleY || props.scale,
      stroke: props.stroke,
      strokeWidth: props.strokeWidth,
      strokeCap: props.strokeCap,
      strokeDash: props.strokeDash,
      strokeJoin: props.strokeJoin,
      fill: props.fill,
    };
    const transformStyle = {};
    const transform = [];
    if (props.hFlip) {
      transform.push({
        rotateY: '180deg',
      });
    }

    if (props.vFlip) {
      transform.push({
        rotateX: '180deg',
      });
    }

    if (transform.length) {
      transformStyle.transform = transform;
    }

    const surfaceStyle = StyleSheet.flatten([
      { backgroundColor: 'transparent' },
      props.style,
      transformStyle,
    ]);

    const containerStyle = { height, width: width * count - offset * (count - 1) };
    let Container = ({ children }) => <View style={containerStyle}>{children}</View>;
    if (
      Platform.OS === 'android' &&
      ReactNativeVersion.version.major * 1000 + ReactNativeVersion.version.minor >= 58
    ) {
      Container = ({ children }) => (
        <View style={containerStyle}>
          <ScrollView scrollEnabled={false}>{children}</ScrollView>
        </View>
      );
    }

    return (
      <Container>
        {this.state.currentAppState && (
          <Surface
            height={height}
            width={width * count - offset * (count - 1)}
            style={surfaceStyle}
          >
            {d.map((path, i) => {
              const isSimpleElement = React.isValidElement(path);
              if (!isSimpleElement) {
                return (
                  <Shape
                    {...ShapeProps}
                    key={ShapeKey++}
                    d={path}
                    x={i > 0 ? width * i - offset * i : 0}
                  />
                );
              }
              return React.cloneElement(path, { ...ShapeProps, ...path.props });
            })}
          </Surface>
        )}
      </Container>
    );
  }
}

IconSVG.defaultProps = {
  d: '',
  fill: '#000',
  height: 44,
  width: 44,
  x: 0,
  y: 0,
  scaleX: null,
  scaleY: null,
  scale: 1.0,
  stroke: null,
  strokeWidth: 1,
  style: null,
  strokeJoin: 'round',
  strokeCap: 'round',
  strokeDash: [0, 0],
  spaceOffset: 0,
};

IconSVG.propTypes = {
  /**
   * ???????????????????????? size ??????
   */
  width: PropTypes.number,
  /**
   * ???????????????????????? size ??????
   */
  height: PropTypes.number,
  /**
   * ?????????????????????
   */
  x: PropTypes.number,
  /**
   * ?????????????????????
   */
  y: PropTypes.number,
  /**
   * ??????????????????
   */
  scaleX: PropTypes.number,
  /**
   * ??????????????????
   */
  scaleY: PropTypes.number,
  /**
   * ??????????????????
   */
  scale: PropTypes.number,
  /**
   * ?????? path???svg ??? path
   */
  d: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  /**
   * ??????????????????????????? color ????????????
   */
  fill: PropTypes.string,
  /**
   * ?????????
   */
  stroke: PropTypes.string,
  /**
   * ????????????
   */
  strokeWidth: PropTypes.number,
  /**
   * ????????????
   */
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  /**
   * ???????????????
   */
  strokeJoin: PropTypes.oneOf(['round', 'miter', 'bevel']),
  /**
   * ??????????????????
   */
  strokeCap: PropTypes.oneOf(['round', 'butt', 'square']),
  /**
   * ?????????????????????????????????????????????????????????????????????????????????
   */
  strokeDash: PropTypes.arrayOf(PropTypes.number),
  /**
   * ?????????????????????, ?????????????????????, ???????????????????????????
   */
  spaceOffset: PropTypes.number,
};

const IconFont = props => {
  const { color, size } = props;
  let { d } = props;
  if (props.name !== undefined) {
    const hasName = Object.prototype.hasOwnProperty.call(DefaultSvgs, props.name);
    d = hasName ? DefaultSvgs[props.name] : undefined;
  }

  let viewBox = [];
  if (typeof d === 'object' && d.d) {
    if (typeof d.viewBox === 'string') {
      viewBox = d.viewBox.split(' ').map(v => parseInt(v, 10));
    }
    d = d.d;
  }
  if (!d) return null;

  const fill = props.fill || color;
  const stroke = props.stroke || color;
  const width = props.width || size;
  const height = props.height || size;

  let x = 0;
  let y = 0;
  let scaleX = 1.0;
  let scaleY = 1.0;

  if (viewBox && viewBox.length === 4) {
    x = props.x || viewBox[0];
    y = props.y || viewBox[1];
    scaleX = props.scaleX || (width - x) / viewBox[2];
    scaleY = props.scaleY || (height - y) / viewBox[3];
  } else {
    x = props.x || 0;
    y = props.y || (props.descent / props.unitsPerEm + 1.0) * height;
    scaleX = props.scaleX || width / props.unitsPerEm;
    scaleY = props.scaleY || -height / props.unitsPerEm;
  }

  return (
    <IconSVG
      {...props}
      width={width}
      height={height}
      x={x}
      y={y}
      scaleX={scaleX}
      scaleY={scaleY}
      fill={fill}
      stroke={stroke}
      d={d}
    />
  );
};

IconFont.defaultProps = {
  color: '#000',
  size: 16,
  unitsPerEm: 1024,
  ascent: 896,
  descent: -128,
  hFlip: null,
  vFlip: null,
  name: undefined,
};

IconFont.propTypes = {
  ...IconSVG.propTypes,
  color: PropTypes.string,
  size: PropTypes.number,
  ascent: PropTypes.number,
  descent: PropTypes.number,
  unitsPerEm: PropTypes.number,
  hFlip: PropTypes.bool,
  vFlip: PropTypes.bool,
  name: PropTypes.string,
};

export default IconFont;
