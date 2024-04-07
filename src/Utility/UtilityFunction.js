export function secondsToString(seconds, compressed = false) {
  let hours = parseInt(seconds / 3600); // 3661/3600 =  1 hour
  seconds = seconds % 3600; // 3661 % 3600 = 61 seconds remaining
  let minutes = parseInt(seconds / 60); // 61/60 =  1 minute
  seconds = seconds % 60; // 61 % 60 = 1 sec remaining
  let timeString = "";
  if (hours) {
    timeString += hours + " hrs ";
  }
  if (minutes) {
    timeString += minutes + " min ";
  }
  if (seconds) {
    timeString += seconds + " sec ";
  }

  if (!compressed) {
    return timeString;
  } else {
    if (hours) {
      return `${hours}h`;
    }
    if (minutes) {
      return `${minutes}m`;
    }
    if (seconds) {
      return `${seconds}s`;
    }
  }
}

export const getFormatedData = (date) => {
  return date.slice(0, 10);
};

export function generatePieChartData(data, topN) {
  // Aggregate active time spent on each website
  const websiteActiveTime = {};
  data.forEach((entry) => {
    const websiteUrl = entry.website_url;
    const activeTimeParts = entry.active_time.split(":").map(Number);
    const activeTimeInSeconds =
      activeTimeParts[0] * 3600 + activeTimeParts[1] * 60 + activeTimeParts[2];
    websiteActiveTime[websiteUrl] =
      (websiteActiveTime[websiteUrl] || 0) + activeTimeInSeconds;
  });

  // Convert the aggregated data to an array of objects
  const websiteDataArray = Object.entries(websiteActiveTime).map(
    ([website, activeTime]) => ({ website, activeTime })
  );

  // Sort the websites based on active time
  websiteDataArray.sort((a, b) => b.activeTime - a.activeTime);

  // Select top N websites by active time
  const topWebsites = websiteDataArray.slice(0, topN);

  // Extract labels and data for Chart.js
  const labels = topWebsites.map((website) => website.website);
  const dataVal = topWebsites.map((website) => website.activeTime);

  return { labels, data: dataVal };
}

export function calculateProductivity(data) {
  let productiveSeconds = 0;
  let unproductiveSeconds = 0;

  data.forEach((entry) => {
    const activeTimeParts = entry.active_time.split(":");
    const seconds =
      +activeTimeParts[0] * 3600 +
      +activeTimeParts[1] * 60 +
      +activeTimeParts[2];

    if (entry.website_url.includes("kapturecrm")) {
      productiveSeconds += seconds;
    } else {
      unproductiveSeconds += seconds;
    }
  });

  productiveSeconds = productiveSeconds ? productiveSeconds : 0;
  unproductiveSeconds = unproductiveSeconds ? unproductiveSeconds : 0;

  const productiveCent =
    (productiveSeconds / (productiveSeconds + unproductiveSeconds)) * 100;

  const unproductiveCent =
    (unproductiveSeconds / (productiveSeconds + unproductiveSeconds)) * 100;

  const productivityRatio = productiveSeconds / unproductiveSeconds;

  return {
    productiveSeconds: !productiveSeconds
      ? "0 sec"
      : secondsToString(productiveSeconds),
    unproductiveSeconds: !unproductiveSeconds
      ? "0 sec"
      : secondsToString(unproductiveSeconds),
    productiveCent: productiveCent.toFixed(2) ? productiveCent.toFixed(2) : "0",
    unproductiveCent: unproductiveCent.toFixed(2)
      ? unproductiveCent.toFixed(2)
      : "0",
    productivityRatio: productivityRatio ? productivityRatio.toFixed(2) : "0",
    graphData: {
      labels: ["Productive Percentage", "Unproductive Percentage"],
      data: [
        productiveCent.toFixed(2) ? productiveCent.toFixed(2) : 0,
        unproductiveCent.toFixed(2) ? unproductiveCent.toFixed(2) : 0,
      ],
    },
  };
}

export function calculateEngagementRate(data) {
  const labels = [];
  const date = [];
  data.forEach((website) => {
    const activeTimeParts = website.active_time.split(":");
    const activeTimeInSeconds =
      +activeTimeParts[0] * 3600 +
      +activeTimeParts[1] * 60 +
      +activeTimeParts[2];
    labels.push(website.website_url);
    date.push(((activeTimeInSeconds / 86400) * 100).toFixed(2)); //86400 sec in a day
  });
  return { labels, date };
}

export const wordMapFunc = (data) => {
  const formattedData = data.map((item) => {
    // Extract website name without "www" and ".com"
    const websiteName = item.website_url
      .replace("www.", "")
      .replace(".com", "");
    // Convert active time to seconds
    const activeTimeInSeconds = convertToSeconds(item.active_time);
    // Create an object with 'text' and 'value' keys
    return {
      text: websiteName,
      value: activeTimeInSeconds,
    };
  });
  return formattedData;
};

const convertToSeconds = (time) => {
  const [hours, minutes, seconds] = time.split(":");
  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
};

function FormatDataFromToday() {
  let today = new Date();

  // Get the year, month, and day
  let year = today.getFullYear();
  let month = (today.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based, so add 1
  let day = today.getDate().toString().padStart(2, "0");

  // Format the date as "YYYY-MM-DD"
  let formattedDate = year + "-" + month + "-" + day;
  return formattedDate;
}

export function getTopAgents(data) {
  // Get today's date
  const today = FormatDataFromToday();

  const filteredData = data.filter((entry) => {
    return (
      entry.date.slice(0, 10) === FormatDataFromToday() &&
      entry.website_url.includes("kapturecrm")
    );
  });

  // Group data by agent_id and calculate total active time
  const agentGroups = {};
  filteredData.forEach((entry) => {
    if (!agentGroups[entry.agent_id]) {
      agentGroups[entry.agent_id] = {
        agent_id: entry.agent_id,
        agent_name: entry.agent_name,
        date: today,
        total_active_time: 0,
      };
    }
    agentGroups[entry.agent_id].total_active_time += parseTime(
      entry.active_time
    );
  });

  // Convert agentGroups object to array
  const agentsArray = Object.values(agentGroups);

  // Sort agents by total_active_time in descending order
  agentsArray.sort((a, b) => b.total_active_time - a.total_active_time);

  // Return top 5 agents
  return agentsArray.slice(0, 5);
}

// Function to parse time string to seconds
function parseTime(timeString) {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

export function getTopVisitedWebsitesTableData(data) {
  // Convert active time to seconds and create a map of website URLs and their total active time
  const websiteMap = {};
  data.forEach((item) => {
    const url = item.website_url;
    const activeTime = item.active_time.split(":");
    const seconds =
      parseInt(activeTime[0]) * 3600 +
      parseInt(activeTime[1]) * 60 +
      parseInt(activeTime[2]);
    if (websiteMap[url]) {
      websiteMap[url].activeTime += seconds;
    } else {
      websiteMap[url] = {
        id: item.id,
        agent_id: item.agent_id,
        agent_name: item.agent_name,
        website_url: item.website_url,
        active_time: seconds,
        date: item.date,
        is_active: item.is_active,
      };
    }
  });

  // Convert map to array of objects for easier sorting
  const websiteArray = Object.values(websiteMap);

  // Sort the array based on active time in descending order
  websiteArray.sort((a, b) => b.active_time - a.active_time);

  // Retrieve the top 10 visited websites
  const topVisitedWebsites = websiteArray.slice(0, 10);

  return topVisitedWebsites;
}

export function teamProductivityFunction(data) {
  let today = new Date().toISOString().split("T")[0];
  let productiveSeconds = 0;
  let unproductiveSeconds = 0;

  // Filter data for today's date
  let todayData = data.filter((entry) => entry.date.split("T")[0] === today);

  // Convert active_time to seconds and categorize based on website_url
  todayData.forEach((entry) => {
    let seconds = entry.active_time
      .split(":")
      .reduce((acc, time) => 60 * acc + +time, 0);
    if (entry.website_url.includes("kapturecrm")) {
      productiveSeconds += seconds;
    } else {
      unproductiveSeconds += seconds;
    }
  });

  // Calculate total seconds and percentages
  let totalSeconds = productiveSeconds + unproductiveSeconds;
  let productivePercentage = (productiveSeconds / totalSeconds) * 100 || 0;
  let unproductivePercentage = (unproductiveSeconds / totalSeconds) * 100 || 0;

  return {
    productivePercentage,
    unproductivePercentage,
  };
}

function timeStringToSeconds(timeString) {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

function getProdDiff(productivity, date, index, dateArr) {
  if (index === 0) {
    return 0;
  } else {
    const prevDate = dateArr[index - 1];
    const prevProductivity = productivity[prevDate];

    const currProductivity = productivity[date];

    return currProductivity.productive - prevProductivity.productive;
  }
}

function getUnProdDiff(productivity, date, index, dateArr) {
  if (index === 0) {
    return 0;
  } else {
    const prevDate = dateArr[index - 1];
    const prevProductivity = productivity[prevDate];

    const currProductivity = productivity[date];

    return currProductivity.unproductive - prevProductivity.unproductive;
  }
}

function calcUnprodDiffCent(productivity, date, index, dateArr) {
  if (index === 0) {
    return 0;
  } else {
    const prevDate = dateArr[index - 1];
    const prevProductivity = productivity[prevDate];

    const currProductivity = productivity[date];
    const cent =
      (currProductivity.unproductive - prevProductivity.unproductive) /
      prevProductivity.unproductive;

    return Math.floor(cent * 100);
  }
}

function calcProdDiffCent(productivity, date, index, dateArr) {
  if (index === 0) {
    return 0;
  } else {
    const prevDate = dateArr[index - 1];
    const prevProductivity = productivity[prevDate];

    const currProductivity = productivity[date];
    const cent =
      (currProductivity.productive - prevProductivity.productive) /
      prevProductivity.productive;

    return Math.floor(cent * 100);
  }
}

export function calculateProductivityForWatchList(data) {
  const productivity = {};

  let finalResult = {};
  data.forEach((entry, index) => {
    const date = entry.date.slice(0, 10);
    const isProductive = entry.website_url.includes("kapturecrm");
    const activeTimeInSeconds = timeStringToSeconds(entry.active_time);

    if (!productivity[date]) {
      productivity[date] = {
        productive: 0,
        unproductive: 0,
        net_productivity: 0,
      };
    }

    if (isProductive) {
      productivity[date].productive += activeTimeInSeconds;
    } else {
      productivity[date].unproductive += activeTimeInSeconds;
    }

    productivity[date].net_productivity =
      productivity[date].productive - productivity[date].unproductive;
  });

  Object.keys(productivity).forEach((date, index) => {
    finalResult[date] = {
      ...productivity[date],
      prod_diff: getProdDiff(
        productivity,
        date,
        index,
        Object.keys(productivity)
      ),
      unprod_diff: getUnProdDiff(
        productivity,
        date,
        index,
        Object.keys(productivity)
      ),
      unproductiveCent: calcUnprodDiffCent(
        productivity,
        date,
        index,
        Object.keys(productivity)
      ),
      productiveCent: calcProdDiffCent(
        productivity,
        date,
        index,
        Object.keys(productivity)
      ),
    };
  });

  return finalResult;
}

export const getWatchBarChartData = (dataVal) => {
  const label = Object.keys(dataVal);
  const data = [];
  const mapData =
    label.length > 6 ? label.slice(label.length - 6, label.length - 1) : label;

  mapData.forEach((date) => {
    const newProd = dataVal[date]["net_productivity"]; // Use date as key to access dataVal
    data.push(Math.abs(newProd));
  });

  return { label, data };
};

export const getLineGraphData = (dataVal) => {
  const label = Object.keys(dataVal);
  const data1 = [];
  const data2 = [];
  const mapData =
    label.length > 6 ? label.slice(label.length - 6, label.length - 1) : label;

  mapData.forEach((date) => {
    const prod = dataVal[date]["productive"];
    const unprod = dataVal[date]["unproductive"];
    data1.push(prod);
    data2.push(unprod);
  });

  return { label, data1, data2 };
};
