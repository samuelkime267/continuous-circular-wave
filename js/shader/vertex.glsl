uniform float uTime;
uniform float uWaves;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uFade;


varying vec2 vUv;
varying vec3 newNormal;
varying vec3 vPosition;
varying float vDistTest;


float PI = 3.141592653589793238;


void main() {
  vec3 newPos = position;
  float len = length(position) - uFade;
  float distTest =  sin(uTime * uSpeed + len * uWaves);


  vDistTest = distTest;
  vDistTest = len;

  newPos.z += distTest * uAmplitude;

  newNormal = normal;
  vUv = uv; 
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );
}