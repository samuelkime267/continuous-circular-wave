uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;


varying vec2 vUv;
varying vec3 vPosition;
varying vec3 newNormal;
varying float vDistTest;


float PI = 3.141592653589793238;


void main()	{
	float fade = 1. - step(0.7 , (vDistTest - 0.07) * 10.);

	vec3 finalColor = vec3(vUv, 0.);
	gl_FragColor = vec4(finalColor, fade);
}