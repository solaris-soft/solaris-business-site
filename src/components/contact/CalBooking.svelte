<script lang="ts">
  export let meetingTypes = [
    { id: "initial-meeting", label: "Initial Meeting" },
    { id: "express-meeting", label: "Express Meeting" },
    { id: "standard-meeting", label: "Standard Meeting" },
    { id: "extended-meeting", label: "Extended Meeting" },
  ];

  import { onMount } from "svelte";
  let isLoading = true;

  // Function to initialize calendar with selected meeting type
  function initializeCalendar(meetingType: string) {
    const cal = (window as any).Cal;
    if (!cal) return;

    isLoading = true;

    // Clear any existing calendar
    const container = document.getElementById("my-cal-inline");
    if (container) {
      container.innerHTML = "";
    }

    // Initialize new calendar with selected type
    cal("init", meetingType, { origin: "https://cal.com" });

    cal.ns[meetingType]("inline", {
      elementOrSelector: "#my-cal-inline",
      config: {
        layout: "month_view",
        theme: "dark",
        hideEventTypeDetails: false,
        iframeAttrs: {
          style:
            "width:1px;min-width:100%;max-width:100%;height:100%;border:none;overflow:hidden;",
        },
        styles: {
          body: {
            background: "transparent",
            fontFamily: "'Satoshi', 'Source Sans Pro', sans-serif",
            width: "1px",
            minWidth: "100%",
            maxWidth: "100%",
            margin: "0",
            padding: "0",
            overflow: "hidden",
            boxSizing: "border-box",
          },
          branding: {
            brandColor: "#ff3d00",
            lightColor: "#ff8a00",
          },
          elements: {
            calendar: {
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              width: "1px",
              minWidth: "100%",
              maxWidth: "100%",
              margin: "0",
              padding: "1rem",
              overflow: "hidden",
              boxSizing: "border-box",
              "@media (max-width: 640px)": {
                padding: "0.5rem",
              },
            },
            calendarContainer: {
              width: "1px",
              minWidth: "100%",
              maxWidth: "100%",
              margin: "0",
              overflow: "hidden",
              boxSizing: "border-box",
            },
            monthContainer: {
              width: "1px",
              minWidth: "100%",
              maxWidth: "100%",
              margin: "0",
              overflow: "hidden",
              boxSizing: "border-box",
            },
            selectedDateBackground: "#ff3d00",
            selectedDateColor: "#ffffff",
            dateText: "#ffffff",
            weekDayText: "rgba(255, 255, 255, 0.7)",
            buttonText: "#ffffff",
            button: {
              backgroundColor: "rgba(255, 61, 0, 0.1)",
              color: "#ff3d00",
              fontSize: "14px",
              padding: "6px 12px",
              textTransform: "none",
              fontWeight: "500",
            },
          },
        },
      },
      calLink: `solaris-software-bookings/${meetingType}`,
    });

    cal.ns[meetingType]("ui", {
      theme: "dark",
      hideEventTypeDetails: false,
      layout: "month_view",
      styles: {
        enabledDateButton: {
          backgroundColor: "rgba(255, 61, 0, 0.1)",
          color: "#ff3d00",
          "&:hover": {
            backgroundColor: "rgba(255, 61, 0, 0.2)",
          },
        },
        disabledDateButton: {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          color: "rgba(255, 255, 255, 0.3)",
        },
      },
    });

    // Set loading to false after a short delay to ensure calendar is rendered
    setTimeout(() => {
      isLoading = false;
    }, 1000);
  }

  onMount(() => {
    // Initialize Cal.com
    (function (C: any, A: string, L: string) {
      let p = function (a: any, ar: any) {
        a.q = a.q || [];
        a.q.push(ar);
      };
      let d = C.document;
      C.Cal =
        C.Cal ||
        function () {
          let cal = C.Cal;
          let ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () {
              p(api, arguments);
            };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else p(cal, ar);
            return;
          }
          p(cal, ar);
        };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    // Initialize with default meeting type
    initializeCalendar("initial-meeting");

    // Add event listener for meeting type selection
    document.getElementById("meeting-type")?.addEventListener("change", (e) => {
      const selectedType = (e.target as HTMLSelectElement).value;
      initializeCalendar(selectedType);
    });
  });
</script>

<div class="outer-container">
  <!-- Main Content -->
  <div class="content-wrapper">
    <div class="w-full max-w-md">
      <label for="meeting-type" class="block mb-2">
        <span
          class="bg-gradient-to-r from-[#ff3d00] to-[#ff8a00] bg-clip-text text-transparent text-base font-medium"
        >
          Select Meeting Duration
        </span>
      </label>
      <div class="relative">
        <select
          id="meeting-type"
          class="w-full bg-black/50 border border-[#ff3d00]/20 text-gray-200 text-base rounded-lg focus:ring-2 focus:ring-[#ff3d00]/50 block p-3 pr-10 transition-all duration-200 appearance-none"
        >
          {#each meetingTypes as type}
            <option value={type.id}>{type.label}</option>
          {/each}
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3"
        >
          <svg
            class="h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>

    <div class="calendar-outer-wrapper mt-10">
      {#if isLoading}
        <div
          class="absolute inset-0 flex items-center justify-center bg-black/50 z-10"
        >
          <div class="animate-spin rounded-full h-12 w-12"></div>
        </div>
      {/if}
      <div class="calendar-inner-wrapper">
        <div id="my-cal-inline"></div>
      </div>
    </div>
  </div>
</div>

<style>
  .outer-container {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    position: relative;
  }

  .content-wrapper {
    width: 100%;
    max-width: 100%;
    padding: 1.5rem;
    overflow: hidden;
    position: relative;
  }

  .calendar-outer-wrapper {
    width: 100%;
    max-width: 100%;
    position: relative;
    background: rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }

  @media (min-width: 640px) {
    .calendar-outer-wrapper {
      border-width: 1px;
      border-radius: 0.75rem;
    }
  }

  .calendar-inner-wrapper {
    width: 100%;
    max-width: 100%;
    position: relative;
    overflow: hidden;
  }

  :global(#my-cal-inline) {
    width: 100% !important;
    max-width: 100% !important;
    min-height: 600px;
    overflow: hidden !important;
  }

  :global(#my-cal-inline > *) {
    width: 100% !important;
    max-width: 100% !important;
    overflow: hidden !important;
  }

  :global(#my-cal-inline iframe) {
    width: 1px !important;
    min-width: 100% !important;
    max-width: 100% !important;
    overflow: hidden !important;
    position: relative !important;
  }

  :global(.cal-embed),
  :global(.cal-embed *) {
    width: 100% !important;
    max-width: 100% !important;
    overflow: hidden !important;
  }

  @media (max-width: 640px) {
    .content-wrapper {
      padding: 1rem;
    }
  }
</style>
