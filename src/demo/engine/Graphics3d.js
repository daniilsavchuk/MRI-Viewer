/**
 * @fileOverview Graphics3d
 * @author Epam
 * @version 1.0.0
 */


// ********************************************************
// Imports
// ********************************************************

import React from 'react';
import { connect } from 'react-redux';

import Modes3d from '../store/Modes3d';

import VolumeRenderer3d from './VolumeRenderer3d'

// ********************************************************
// Const
// ********************************************************

// ********************************************************
// Class
// ********************************************************

/**
 * Class Graphics2d some text later...
 */
class Graphics3d extends React.Component {
  /**
   * @param {object} props - props from up level object
   */
  constructor(props) {
    super(props);
    this.m_width = props.wScreen;
    this.m_height = props.hScreen;
    this.isLoaded = false;
    this.volume = null;

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
    this.renderScene = this.renderScene.bind(this);

    this.m_mount = null;
    this.m_volumeRenderer3D = null;
    this.m_renderer = null;
    // animation
    this.m_frameId = null;
    // settings
    this.m_mode3d = Modes3d.ISO;
    this.m_slider3dr = 0.1;
    this.m_slider3dg = 0.5;
    this.m_slider3db = 0.8;
    this.m_fileDataType = {
      thresholdIsosurf: 0.46,
      thresholdTissue1: 0.09,
      thresholdTissue2: 0.30,
      opacityTissue: 0.53,
      startRotX: -Math.PI * 0.5,
      startRotY: Math.PI,
      lightDirComp: -0.5773,
      brightness: 0.56,
    };
  }
  start() {
    if (this.m_frameId === null) {
      this.m_frameId = requestAnimationFrame(this.animate);
    }
  }
  stop() {
    cancelAnimationFrame(this.m_frameId);
    this.m_frameId = null;
  }
  animate() {
    /*this.m_mesh.rotation.x += 0.01;
    this.m_mesh.rotation.y += 0.01;
    this.m_material.color.setRGB(this.m_slider3dr, this.m_slider3dg, this.m_slider3db);
    this.m_material.wireframe = (this.m_mode3d === Modes3d.ISO);*/
 
    this.renderScene();
    this.m_frameId = window.requestAnimationFrame(this.animate);
  }
  renderScene() {
    // this.m_renderer.render(this.m_scene, this.m_camera);
    if (this.m_volumeRenderer3D !== null) {
      this.m_volumeRenderer3D.render();
    }
  }
  componentDidMount() {
    /*const w = this.m_mount.clientWidth;
    const h = this.m_mount.clientHeight;
    this.m_scene = new THREE.Scene();
    this.m_camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    this.m_camera.position.z = 4;

    this.m_renderer = new THREE.WebGLRenderer({ antialias: true });
    this.m_renderer.setClearColor('#000000');
    this.m_renderer.setSize(w, h);
    this.m_mount.appendChild(this.m_renderer.domElement);

    this.m_geometry = new THREE.BoxGeometry(1, 1, 1);
    this.m_material = new THREE.MeshBasicMaterial({ color: '#ff1122' });
    this.m_mesh = new THREE.Mesh(this.m_geometry, this.m_material);
    this.m_scene.add(this.m_mesh);*/
    if (this.m_volumeRenderer3D === null) {
      this.m_volumeRenderer3D = new VolumeRenderer3d({
        curFileDataType: this.m_fileDataType,
        width: this.m_mount.clientWidth,
        height: this.m_mount.clientHeight,
        mount: this.m_mount
      });
    }
    if (this.volume !== null && this.isLoaded === false && this.m_volumeRenderer3D !== null) {      
      this.m_volumeRenderer3D.initWithVolume(this.volume, { x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 });
      this.isLoaded = true;
    }
    this.start();
  }
  componentWillUnmount() {
    this.stop()
    if (this.m_renderer !== null) {
      this.m_mount.removeChild(this.m_renderer.domElement);
    }
    this.m_volumeRenderer3D = null;
  }
  /**
   * Main component render func callback
   */
  render() {
    const wScreen = this.props.wScreen;
    const hScreen = this.props.hScreen;
    const store = this.props;
    const vol = store.volume;
    // const tex3d = this.props.texture3d;
    if (vol !== null) {
      this.volume = vol;
    }

    if (this.m_volumeRenderer3D !== null) {
      this.m_volumeRenderer3D.render();
    }

    const mode3d = store.mode3d;
    const slider3dr = store.slider3d_r;
    const slider3dg = store.slider3d_g;
    const slider3db = store.slider3d_b;

    this.m_mode3d = mode3d;
    this.m_slider3dr = slider3dr;
    this.m_slider3dg = slider3dg;
    this.m_slider3db = slider3db;

    const strW = wScreen.toString(10);
    const strH = hScreen.toString(10);
    const jsxCanvas = <div style={{ width: strW + 'px', height: strH + 'px' }} ref={ (mount) => {this.m_mount = mount} }/>
    return jsxCanvas;
  }
}

export default connect(store => store)(Graphics3d);
 