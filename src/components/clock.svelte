<script context="module">
  const vbWidth = 210,
    vbHeight = 100,
    clockRadius = (vbHeight * 0.95) / 2;
  export const clockShapeAngle = Math.PI / 3,
    clockShapeWidthMin = vbWidth - vbHeight / Math.tan(clockShapeAngle);
  export let clockSvg;
</script>

<script lang="ts">
  import type Color from 'color';
  import { onMount } from 'svelte';
  import { zeroPadTime } from '../functions/zeroPadTime';

  type SVGProperties = {
    strokeColor?: Color;
    strokeWidth?: number;
    fillColor?: Color | 'none';
    fillColor2?: Color | 'none';
    fontSize?: number;
  };

  export let width: string,
    height: string,
    circle: SVGProperties,
    hourHand: SVGProperties,
    minuteHand: SVGProperties,
    secondHand: SVGProperties,
    timeDisplay: SVGProperties,
    menuBarHeight = 12;

  let hourHandRotation: number = 290.6,
    minuteHandRotation: number = 247,
    secondHandRotation: number = 59.94,
    displayDate: `${string}/${string}/${string}` = '2007/06/29',
    displayHours: string = '09',
    displayMinutes: string = '41',
    displaySeconds: string = '10',
    outlineWidth = hourHand.strokeWidth * 1.5;

  onMount(() => {
    function clock() {
      const date = new Date();
      requestAnimationFrame(clock);
      hourHandRotation =
        ((date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600) / 12) * 360;
      minuteHandRotation = ((date.getMinutes() + date.getSeconds() / 60) / 60) * 360;
      secondHandRotation = ((date.getSeconds() + date.getMilliseconds() / 1000) / 60) * 360;
      displayDate = `${date.getFullYear()}/${zeroPadTime(date.getMonth() + 1)}/${zeroPadTime(
        date.getDate()
      )}`;
      displayHours = zeroPadTime(date.getHours());
      displayMinutes = zeroPadTime(date.getMinutes());
      displaySeconds = zeroPadTime(date.getSeconds());
    }
    requestAnimationFrame(clock);
  });
</script>

<svg viewBox="0 0 {vbWidth} {vbHeight}" style="width:{width}; height:{height}; top: {menuBarHeight}px" bind:this={clockSvg}>
  <polygon
    points="
      0,0
      {vbWidth},0
      {clockShapeWidthMin},{vbHeight}
      0,{vbHeight}
    "
    fill="#00062fcc"
  />
  <polyline
    points="
      0,{vbHeight - outlineWidth / 2}
      {vbWidth -
      vbHeight / Math.tan(clockShapeAngle) -
      outlineWidth / Math.sin(clockShapeAngle) / 2},{vbHeight - outlineWidth / 2}
      {vbWidth - outlineWidth / Math.sin(clockShapeAngle) / 2},0
    "
    stroke={String(hourHand.strokeColor)}
    stroke-width={outlineWidth}
    fill="none"
  />
  <text
    class="clip"
    x={vbWidth}
    y={(timeDisplay.fontSize * 7) / 12 + (vbHeight / 2 - clockRadius) + circle.strokeWidth}
    font-size={timeDisplay.fontSize}
    text-anchor="end"
    fill={String(timeDisplay.fillColor)}
  >
    {displayDate} .
  </text>
  <text
    class="clip"
    x={vbHeight}
    y={((timeDisplay.fontSize * 7) / 12) * 4}
    font-size={timeDisplay.fontSize * 2}
    fill={String(timeDisplay.fillColor)}
  >
    {displayHours} .
  </text>
  <text
    class="clip"
    x={vbHeight}
    y={((timeDisplay.fontSize * 7) / 12) * 6.7}
    font-size={timeDisplay.fontSize * 2}
    fill={String(timeDisplay.fillColor)}
  >
    :{displayMinutes} .
  </text>
  <text
    class="clip"
    x="88"
    y={50 + clockRadius - circle.strokeWidth}
    font-size={timeDisplay.fontSize * 2}
    fill={String(timeDisplay.fillColor)}
  >
    {displaySeconds} .
  </text>
  <circle
    cx="50"
    cy="50"
    r={clockRadius - circle.strokeWidth}
    stroke={String(circle.strokeColor)}
    stroke-width={circle.strokeWidth}
    fill={String(circle.fillColor)}
  />
  <line
    x1="50"
    y1="50"
    x2="50"
    y2={clockRadius - (clockRadius - circle.strokeWidth) * 0.64}
    stroke={String(hourHand.strokeColor)}
    stroke-width={hourHand.strokeWidth}
    stroke-linecap="round"
    fill={String(hourHand.fillColor)}
    transform="rotate({hourHandRotation} 50 50)"
  />
  <line
    x1="50"
    y1="50"
    x2="50"
    y2={clockRadius - (clockRadius - circle.strokeWidth) * 0.8}
    stroke={String(minuteHand.strokeColor)}
    stroke-width={minuteHand.strokeWidth}
    stroke-linecap="round"
    fill={String(minuteHand.fillColor)}
    transform="rotate({minuteHandRotation} 50 50)"
  />
  <line
    x1="50"
    y1="50"
    x2="50"
    y2={clockRadius - (clockRadius - circle.strokeWidth) * 0.85}
    stroke={String(secondHand.strokeColor)}
    stroke-width={secondHand.strokeWidth}
    stroke-linecap="round"
    fill={String(secondHand.fillColor)}
    transform="rotate({secondHandRotation} 50 50)"
  />
</svg>

<style lang="stylus">
  svg
    font-family: GrandNationalItalic, sans-serif
    .clip
      clip-path: inset(0 0.5ch 0 0)
</style>
