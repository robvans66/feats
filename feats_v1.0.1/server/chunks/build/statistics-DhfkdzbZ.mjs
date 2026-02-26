import { _ as __nuxt_component_0 } from './Table-DwztE0l3.mjs';
import { defineComponent, computed, ref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "statistics",
  __ssrInlineRender: true,
  setup(__props) {
    const currentYear = computed(() => (/* @__PURE__ */ new Date()).getFullYear());
    const stats = ref({ yearTotals: [], perBike: [], longestPerYear: [], monthlyTotals: [], ridesOver100ByYear: [] });
    const selectedYearTotal = ref(null);
    const selectedBike = ref(null);
    const selectedLongestYear = ref(null);
    const selectedOver100Year = ref(null);
    const yearTotalsState = ref({ sorting: [] });
    const longestPerYearState = ref({ sorting: [] });
    const perBikeState = ref({ sorting: [] });
    const ridesOver100State = ref({ sorting: [{ id: "year", desc: true }] });
    const yearTotalsColumns = [
      { accessorKey: "year", headerLabel: "Year", enableSorting: true },
      { accessorKey: "distance", headerLabel: "Distance", enableSorting: true },
      { accessorKey: "rides", headerLabel: "Total Rides", enableSorting: true }
    ];
    const longestPerYearColumns = [
      { accessorKey: "year", headerLabel: "Year", enableSorting: true },
      { accessorKey: "longest", headerLabel: "Longest Ride", enableSorting: true }
    ];
    const perBikeColumns = [
      { accessorKey: "bike", headerLabel: "Bike", enableSorting: true },
      { accessorKey: "distance", headerLabel: "Distance", enableSorting: true },
      { accessorKey: "rides", headerLabel: "Number", enableSorting: true }
    ];
    const ridesOver100Columns = [
      { accessorKey: "year", headerLabel: "Year", enableSorting: true },
      { accessorKey: "count", headerLabel: "Rides > 100km", enableSorting: true },
      {
        accessorKey: "distancesFormatted",
        headerLabel: "Distances (km)",
        enableSorting: false,
        cell: (ctx) => ctx.getValue()
      }
    ];
    function setYearTotalsState(updater) {
      yearTotalsState.value = typeof updater === "function" ? updater(yearTotalsState.value) : updater;
    }
    function setLongestPerYearState(updater) {
      longestPerYearState.value = typeof updater === "function" ? updater(longestPerYearState.value) : updater;
    }
    function setPerBikeState(updater) {
      perBikeState.value = typeof updater === "function" ? updater(perBikeState.value) : updater;
    }
    function setRidesOver100State(updater) {
      ridesOver100State.value = typeof updater === "function" ? updater(ridesOver100State.value) : updater;
    }
    const sortedYearTotals = computed(() => {
      const sorted = sortData(stats.value.yearTotals, yearTotalsState.value.sorting);
      const totalDistance = stats.value.yearTotals.reduce((sum, item) => sum + (item.distance || 0), 0);
      const totalRides = stats.value.yearTotals.reduce((sum, item) => sum + (item.rides || 0), 0);
      const grandTotal = {
        year: "Grand Total",
        distance: Math.round(totalDistance * 100) / 100,
        rides: totalRides,
        isGrandTotal: true
      };
      return [...sorted, grandTotal];
    });
    const sortedLongestPerYear = computed(() => {
      return sortData(stats.value.longestPerYear, longestPerYearState.value.sorting);
    });
    const sortedPerBike = computed(() => {
      return sortData(stats.value.perBike, perBikeState.value.sorting);
    });
    const sortedRidesOver100 = computed(() => {
      const formatted = stats.value.ridesOver100ByYear.map((item) => {
        const distances = item.distances || [];
        const displayDistances = distances.slice(0, 15);
        const remaining = distances.length - 15;
        let distancesText = displayDistances.join(", ");
        if (remaining > 0) {
          distancesText += ` and ${remaining} more`;
        }
        return {
          ...item,
          distancesFormatted: distancesText
        };
      });
      return sortData(formatted, ridesOver100State.value.sorting);
    });
    function sortData(data, sorting) {
      if (!sorting || sorting.length === 0) return data;
      const sortSpec = sorting[0];
      const sorted = [...data].sort((a, b) => {
        const aVal = a[sortSpec.id];
        const bVal = b[sortSpec.id];
        if (aVal === bVal) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (typeof aVal === "number" && typeof bVal === "number") {
          return aVal - bVal;
        }
        return String(aVal).localeCompare(String(bVal));
      });
      return sortSpec.desc ? sorted.reverse() : sorted;
    }
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const uniqueYears = computed(() => {
      const years = new Set(stats.value.monthlyTotals.map((m) => m.year));
      return Array.from(years).sort((a, b) => b - a);
    });
    function getMonthData(year, month) {
      const paddedMonth = String(month).padStart(2, "0");
      return stats.value.monthlyTotals.find((m) => m.year === year && m.month === paddedMonth);
    }
    function toggleSelectedYearTotal(year) {
      selectedYearTotal.value = selectedYearTotal.value === year ? null : year;
    }
    function toggleSelectedBike(bike) {
      selectedBike.value = selectedBike.value === bike ? null : bike;
    }
    function toggleSelectedLongestYear(year) {
      selectedLongestYear.value = selectedLongestYear.value === year ? null : year;
    }
    function toggleSelectedOver100Year(year) {
      selectedOver100Year.value = selectedOver100Year.value === year ? null : year;
    }
    const earthCircumferences = computed(() => {
      const totalDistance = stats.value.yearTotals.reduce((sum, item) => sum + (item.distance || 0), 0);
      return Math.round(totalDistance / 4e4 * 100) / 100;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Table = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(_attrs)}><h1 class="text-3xl font-semibold mb-6">Statistics</h1><div class="fun-fact mb-8 p-4"><p class="text-lg font-semibold"> Great! You cycled around the earth <span class="circumferences font-bold">${ssrInterpolate(earthCircumferences.value)}</span> times. Keep on pedaling! </p></div><div class="grid gap-15 lg:grid-cols-3"><div><h2 class="text-xl font-semibold mb-3">Year Totals</h2><div class="table-statistics bg-white border">`);
      _push(ssrRenderComponent(_component_Table, {
        id: "year-totals",
        data: sortedYearTotals.value,
        columns: yearTotalsColumns,
        state: yearTotalsState.value,
        "on-state-change": setYearTotalsState,
        "on-select": (_e, row) => toggleSelectedYearTotal(row.year),
        "selected-row-id": selectedYearTotal.value
      }, null, _parent));
      _push(`</div></div><div><h2 class="text-xl font-semibold mb-3">Longest Ride per Year</h2><div class="table-statistics bg-white border">`);
      _push(ssrRenderComponent(_component_Table, {
        data: sortedLongestPerYear.value,
        columns: longestPerYearColumns,
        state: longestPerYearState.value,
        "on-state-change": setLongestPerYearState,
        "on-select": (_e, row) => toggleSelectedLongestYear(row.year),
        "selected-row-id": selectedLongestYear.value
      }, null, _parent));
      _push(`</div></div><div><h2 class="text-xl font-semibold mb-3">Distance and Rides per Bike in ${ssrInterpolate(currentYear.value)}</h2><div class="table-statistics bg-white border">`);
      _push(ssrRenderComponent(_component_Table, {
        data: sortedPerBike.value,
        columns: perBikeColumns,
        state: perBikeState.value,
        "on-state-change": setPerBikeState,
        "on-select": (_e, row) => toggleSelectedBike(row.bike),
        "selected-row-id": selectedBike.value
      }, null, _parent));
      _push(`</div></div></div><div class="mt-12"><h2 class="text-xl font-semibold mb-3">Rides Over 100km per Year</h2><div class="table-statistics bg-white border">`);
      _push(ssrRenderComponent(_component_Table, {
        data: sortedRidesOver100.value,
        columns: ridesOver100Columns,
        state: ridesOver100State.value,
        "on-state-change": setRidesOver100State,
        "on-select": (_e, row) => toggleSelectedOver100Year(row.year),
        "selected-row-id": selectedOver100Year.value
      }, null, _parent));
      _push(`</div></div><div class="mt-12"><h2 class="text-xl font-semibold mb-3">Monthly Totals by Year</h2><div class="bg-white border overflow-x-auto"><table class="table-statistics min-w-full"><thead><tr class="bg-gray-100"><th class="p-2">Year</th><!--[-->`);
      ssrRenderList(monthNames, (month) => {
        _push(`<th class="p-2">${ssrInterpolate(month)}</th>`);
      });
      _push(`<!--]--></tr></thead><tbody><!--[-->`);
      ssrRenderList(uniqueYears.value, (year) => {
        _push(`<tr><td class="p-2 font-semibold">${ssrInterpolate(year)}</td><!--[-->`);
        ssrRenderList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], (monthNum) => {
          _push(`<td class="p-2 border-l text-xs">`);
          if (getMonthData(year, monthNum)) {
            _push(`<div><div>${ssrInterpolate(getMonthData(year, monthNum).distance)} km</div><div class="text-gray-600">${ssrInterpolate(getMonthData(year, monthNum).rides)} rides</div></div>`);
          } else {
            _push(`<div class="text-gray-400">-</div>`);
          }
          _push(`</td>`);
        });
        _push(`<!--]--></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/statistics.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=statistics-DhfkdzbZ.mjs.map
