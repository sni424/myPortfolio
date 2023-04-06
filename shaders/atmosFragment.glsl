
varying vec3 vertexNormal;

void main(){
    float intensity= pow(0.65- dot(vertexNormal,vec3(0.0,0.0,1.0)),4.0);
    gl_FragColor =  vec4(0.1922, 0.3451, 0.5412, 1.0)*intensity;
}

