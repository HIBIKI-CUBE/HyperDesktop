<script lang="ts">
  import { clockSvg, clockShapeWidthMin, clockShapeAngle } from './clock.svelte';
  import { onMount } from 'svelte';
  import { zeroPadTime } from '../functions/zeroPadTime';
  import { loadDefaultJapaneseParser } from 'budoux';
  const parser = loadDefaultJapaneseParser();

  export let menuBarHeight = 12;
  const heightRatioToClock = 0.9;
  let left = 0,
    height = 0,
    width = 0,
    scroll = 0,
    container: HTMLElement,
    calendarReloadStart = false;

  function convertZoomUrl(url) {
    if (!url.includes('zoom')) return url;
    const info = url
      .split('/')
      .filter((v) => v.includes('?'))[0]
      .split('?');
    return `zoommtg://${url.split('/').filter((v) => v.includes('zoom'))[0]}/join?confno=${
      info[0]
    }&${info.filter((v) => v.includes('pwd='))}`;
    // https://dendai.zoom.us/j/91975674212?pwd=b3N2OHluZ2FmaWI1SEkza1RTSVdlZz09
    // zoommtg://zoom.us/join?confno=123456789&pwd=xxxx
  }

  async function fetchCalendar() {
    const res = await fetch('/calendar.json');
    try {
      return await res.json();
    } finally {
      setTimeout(() => (container = document.querySelector('.container')));
    }
  }

  let scrollTimer = 0;
  function scrollHandler() {
    requestAnimationFrame(() => {
      clearTimeout(scrollTimer);
      scroll = container.scrollTop;
    });
    setTimeout(() => {
      scrollTimer = window.setTimeout(
        () =>
          requestAnimationFrame((time) => {
            container.removeEventListener('scroll', scrollHandler);
            smoothScroll(time, time, container.scrollTop, container);
          }),
        5000
      );
    });
  }

  function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  const scroll_duration = 400; //ms

  function smoothScroll(time, start_time, origin, element) {
    if (time == start_time) {
      requestAnimationFrame((time) => smoothScroll(time, start_time, origin, element));
      return;
    }
    element.scrollTo({
      top: origin + origin * -1 * easeInOutCubic((time - start_time) / scroll_duration)
    });
    scroll = container.scrollTop;
    if (time - start_time > scroll_duration) {
      container.addEventListener('scroll', scrollHandler);
      return;
    }
    requestAnimationFrame((time) => smoothScroll(time, start_time, origin, element));
  }

  onMount(() => {
    let initialLayoutSetTime = performance.now();
    requestAnimationFrame((time) => {
      initialLayoutSetTime = time;
      setLayout(time);
    });
    function setLayout(time) {
      if (time - initialLayoutSetTime < 1000 || time < 0) {
        const leftGap =
          (clockSvg.getBoundingClientRect().height * (1 - heightRatioToClock)) /
          Math.tan(clockShapeAngle);
        left =
          (clockSvg.getBoundingClientRect().width / 210) * clockShapeWidthMin +
          (leftGap > 0 ? leftGap : 0);
        height = clockSvg.getBoundingClientRect().height * heightRatioToClock;
        width = container.getBoundingClientRect().width;
        if (time > 0) requestAnimationFrame(setLayout);
      }
    }
    addEventListener('resize', () => requestAnimationFrame(() => setLayout(-1)));

    container.addEventListener('scroll', scrollHandler);
    setInterval(() => {
      calendarReloadStart = true;
      setTimeout(() => (calendarReloadStart = false));
    }, 15 * 60 * 1000);
  });
</script>

<svg
  viewBox="0 0 {width} {height}"
  style="
    width: calc((100% - {left}px) / 3);
    height: {height}px;
    left: {left}px;
    top: {menuBarHeight}px;
  "
>
  <polygon
    points="
    {height / Math.tan(clockShapeAngle)},0
    {width},0
    {width},{height}
    0,{height}
  "
    fill="#00062fcc"
  />
</svg>
<div
  class="container"
  style="
    width: calc((100% - {left}px) / 3);
    height: {height}px;
    left: {left}px;
    top: {menuBarHeight}px;
  "
  bind:this={container}
>
  {#if !calendarReloadStart}
    {#await fetchCalendar()}
      Loading...
    {:then calendar}
      <div
        style="
        width: {height / Math.tan(clockShapeAngle)}px;
        height: {container?.scrollHeight}px;
        left: {left}px;
        shape-outside: polygon(0 {scroll}px, {height /
          Math.tan(clockShapeAngle)}px {scroll}px, 0 {height + scroll}px);
        float: left;
      "
      />
      {#each calendar as event, i}
        {#if new Date(event.start).getDate() != new Date(calendar[i - 1]?.start).getDate() && new Date(event.start).getDate() != new Date().getDate()}
          <div class="line date">
            {new Date(event.start).getMonth() + 1}/
            {zeroPadTime(new Date(event.start).getDate())}
          </div>
        {/if}
        <a
          href={event.location.includes('//')
            ? convertZoomUrl(event.location)
            : convertZoomUrl(event.url) || '#'}
        >
          <div class="line">
            <span
              class="title"
              style="color: {(() => {
                switch (event.calendar) {
                  case '技研カレンダー':
                    return '#AB735D';
                  case 'test':
                    return '#4887E7';
                  case '日本の祝日':
                    return '#FF2969';
                  case 'Contacts':
                    return '#FFC6EF';
                  case 'hibiki.apple.1984@gmail.com':
                    return '#FE9503';
                  case '勉強予定 記録':
                    return '#AD8E68';
                  case '受験':
                    return '#AD8E68';
                  case '大学の時間割':
                    return '#12A3FF';
                  case '移動':
                    return '#FED709';
                  case '息子の個人的な予定':
                    return '#32D74B';
                  case 'JVU予定合わせ':
                    return '#C9BEBF';
                }
              })()};
          word-break: keep-all;
          overflow-wrap: break-word;"
            >
              {#each parser.parse(event.title.replace(/[ 　\t\s]{2,}/, ' ')) as unit}
                {unit}<wbr />
              {/each}
            </span>
            {#if event.location || event.url}
              <span class="chunk">
                <span class="at"> At </span>
                <span class="location">
                  {event.location.includes('zoom') ? 'zoom' : event.location}
                </span>
              </span>
            {/if}
            {#if !event.isFullDay}
              <span class="chunk">
                <span class="time">
                  {new Date(event.start).getHours()}:{zeroPadTime(
                    new Date(event.start).getMinutes()
                  )}
                </span>
              </span>
            {/if}
          </div>
        </a>
      {/each}
    {/await}
  {/if}
</div>

<style lang="stylus">
  .container
    font-family: GrandNationalItalic, NicoKaku
    color: white !important
    position: absolute
    overflow-y: scroll
    text-align: right
    font-size: 0.75em
  a
    color: white
    text-decoration: none
    &[href="#"]
      cursor: default
  svg
    position: fixed
  .line
    padding-right: 0.5ch
    &:hover
      filter: brightness(0.8)
    &.date
      margin-top: 0.5em
    .chunk
      display: inline-block
    .at
      color: #00FAFE
    .time
      color: #FEF900
</style>
