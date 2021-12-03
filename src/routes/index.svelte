<!-- <script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ fetch }) => {
    const res = await fetch('/calendar.json');

    if (res.ok) {
      const calendar = await res.json();
      return {
        props: { calendar }
      };
    }

    const { message } = await res.json();

    return {
      error: new Error(message)
    };
  };
</script> -->

<script lang="ts">
  import Clock from '/src/components/clock.svelte';
  import Calendar from '/src/components/calendar.svelte';
  let referenceVisible = false,
    menuBarHeight = 12;

  export let calendar = [];
</script>

<svelte:window on:keydown={e => menuBarHeight += (e.key == "ArrowUp" ? -1 : e.key == "ArrowDown" ? 1 : 0)}/>

<svelte:body on:click={() => (referenceVisible = !referenceVisible)} />
<img src="reference.jpg" alt="" style="visibility: {referenceVisible ? 'visible' : 'hidden'}" />

<!-- <svg viewBox="0 0 1000 1000" preserveAspectRatio="none">
  <rect x="0" y="0" width="50%" height="50%">
</svg> -->
<div style="--opacity: {referenceVisible ? 0.5 : 1}">
  <Clock
    width="52.5vh"
    height="25vh"
    left="1ch"
    top="2ch"
    {menuBarHeight}
    circle={{
      strokeWidth: 1,
      strokeColor: '#fff',
      fillColor: 'none'
    }}
    hourHand={{
      strokeWidth: 1.5,
      strokeColor: '#02B3FA',
      fillColor: 'none'
    }}
    minuteHand={{
      strokeWidth: 1.5,
      strokeColor: '#02B3FA',
      fillColor: 'none'
    }}
    secondHand={{
      strokeWidth: 1,
      strokeColor: '#02B3FA88',
      fillColor: 'none'
    }}
    timeDisplay={{
      fillColor: '#fff',
      fillColor2: '#888',
      fontSize: 17
    }}
  />
  <Calendar {calendar} {menuBarHeight}/>
</div>

<style lang="stylus">
  @font-face
    font-family: GrandNationalItalic;
    src: url(/grandnationalital.ttf);
  @font-face
    font-family: NicoKaku;
    src: url(/nicokaku_v1.ttf);

  :global(html), :global(body)
    margin: 0
    height: 100%

  img
    position: fixed
    top: -26px
    width: 100%
    height: calc(100% + 26px)
    clip-path: inset(26px 0 0 0)
    opacity: 0.2
  
  :global(svg)
    opacity: var(--opacity)
    width: 100%
    height: 100%
    position: absolute
    top: 0
    left: 0
</style>
