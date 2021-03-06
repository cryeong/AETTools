# AETTools
AETTools is a tool initially built to visualise the geometry relation of the page flipping graphical effect (i.e. Apple iBook PageController). It works as an external script, which will be injected into the webpage and initialise a SVG view on top of the original content.

The tool compile a simple script written in GLSL like language, and render the result in the SVG view.

Click [here](https://dl.dropboxusercontent.com/u/56320860/demo-2.html) for demo.

# Syntax

Sample scripts
```
float i1 = 0
float i2 = 0
float i3 = 9
float i4 = 0
float radius = 150.0
float rad = 1 * PI / i3
float localr = 0
float r = atan2( my, mx )
vec2 tail = vec2(0,0)
while( i1 < i3 ) {
	localr = i1 * rad + r
	float vx = cos( localr ) * radius
	float vy = sin( localr ) * radius
	// draw the line
	vec2( 0, 0 ) _ vec2( vx,vy )
	i4 = 0
	while( i4 < i3 ) {
	  tail = vec2( vx + cos( i4 * rad - localr ) * radius, vy + sin(i4 * rad - localr ) * radius )
		vec2( vx, vy ) _ tail
		i4 = i4 + 1
	}
	i1 = i1 + 1
}
// i1 = %i1
// i2 = %i2
// rad = %rad

```

#Screenshot

Result from sample script above:
![alt tag](https://raw.githubusercontent.com/cryeong/AETTools/master/screenshot.png)

How it was used to visualise the math relation behind page flipping effect.
![alt tag](https://raw.githubusercontent.com/cryeong/AETTools/master/screenshot2.png)
