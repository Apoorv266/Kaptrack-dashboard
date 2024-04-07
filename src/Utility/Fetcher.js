const getAllAgentsData = async () => {
  try {
    const response = await fetch(
      "http://node.kapture.cx/kap-track/get-all-agents"
    );
    console.log(response.json());
    if (!response) {
      throw new Error("Error fetching all agents data:", response.statusText);
    }
    return await response.json();
  } catch (error) {
    throw new Error("Error fetching all agents data:", error);
  }
};

const getAgentHistory = async (agentId, date) => {
  try {
    const response = await fetch(
      `http://node.kapture.cx/kap-track/get-agent-history/${agentId}?${date}`
    );
    if (!response) {
      throw new Error("Error fetching agent history:", response.statusText);
    }
    return await response.json();
  } catch (error) {
    throw new Error("Error fetching agent history:", error);
  }
};

export function getAllAgentHistory() {
  return new Promise((resolve, reject) => {
    try {
      const url = `http://node.kapture.cx/kap-track/get-all-history`;
      const response = fetch(url);

      if (response) {
        resolve(response.JSON());
      } else {
        reject(new Error("Error in fetching agent data", response));
      }
    } catch (er) {
      console.error("Error occured in getQAMetriceList", er);
      reject(er);
    }
  });
}
const sendEmailAlert = async (toUser, emailBody) => {
  try {
    const response = await fetch(
      `http://node.kapture.cx/kap-track/send-email-alert`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ toUser, emailBody }),
      }
    );
    if (!response) {
      throw new Error("Error sending email:", response.statusText);
    }
    return await response.json();
  } catch (error) {
    throw new Error("Sending Email:", error);
  }
};

module.exports = { getAllAgentsData, getAgentHistory, sendEmailAlert };
