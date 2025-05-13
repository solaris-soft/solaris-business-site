<script lang="ts">
  export let meetingTypes = [
    { id: "initial-meeting", label: "Initial Meeting" },
    { id: "express-meeting", label: "Express Meeting" },
    { id: "standard-meeting", label: "Standard Meeting" },
    { id: "extended-meeting", label: "Extended Meeting" },
  ];

  import { onMount } from 'svelte';

  // Function to initialize calendar with selected meeting type
  function initializeCalendar(meetingType: string) {
    const cal = (window as any).Cal;
    if (!cal) return;
    
    // Clear any existing calendar
    const container = document.getElementById("my-cal-inline");
    if (container) {
      container.innerHTML = "";
    }

    // Initialize new calendar with selected type
    cal("init", meetingType, { origin: "https://cal.com" });

    cal.ns[meetingType]("inline", {
      elementOrSelector: "#my-cal-inline",
      config: { layout: "month_view", theme: "dark" },
      calLink: `solaris-software-bookings/${meetingType}`,
    });

    cal.ns[meetingType]("ui", {
      theme: "dark",
      hideEventTypeDetails: false,
      layout: "month_view",
    });
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

<div class="relative">
  <!-- Background layers -->
  <div class="absolute inset-[1px] rounded-2xl bg-black/90 backdrop-blur-sm"></div>
  <div class="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent opacity-50"></div>

  <!-- Main Content -->
  <div class="relative p-8">
    <p class="text-white/70 text-base mb-8">
      Choose your preferred meeting duration and select a time that works for you. Initial meetings are free of charge.
    </p>

    <div class="mb-8">
      <label for="meeting-type" class="block mb-2">
        <span class="bg-gradient-to-r from-[#ff3d00] to-[#ff8a00] bg-clip-text text-transparent text-base font-normal">
          Select Meeting Duration
        </span>
      </label>
      <select
        id="meeting-type"
        class="w-full max-w-md bg-black/50 border border-[#ff3d00]/20 text-gray-200 text-base rounded-lg focus:ring-[#ff3d00] focus:border-[#ff3d00] block p-3 transition-colors duration-200"
      >
        {#each meetingTypes as type}
          <option value={type.id}>{type.label}</option>
        {/each}
      </select>
    </div>
    <div class="bg-black/30 rounded-xl p-4 border border-[#ff3d00]/20">
      <div style="width:100%;height:100%;overflow:scroll" id="my-cal-inline" class="w-full"></div>
    </div>
  </div>
</div> 