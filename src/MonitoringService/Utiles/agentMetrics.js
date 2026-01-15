export const calculateAgentMetrics = (agents) => {
  if (!agents || !Array.isArray(agents) || agents.length === 0) {
    return {
      totalAgents: 0,
      averagePerformance: 0,
      highestPerformance: 0,
      lowestPerformance: 0,
      highestAgent: null,
      lowestAgent: null,
    };
  }

  const totalAgents = agents.length;
  const totalScore = agents.reduce((sum, agent) => sum + agent.score, 0);
  const averagePerformance = Math.round(totalScore / totalAgents);

  const highestAgent = agents.reduce((highest, agent) =>
    agent.score > highest.score ? agent : highest
  );

  const lowestAgent = agents.reduce((lowest, agent) =>
    agent.score < lowest.score ? agent : lowest
  );

  return {
    totalAgents,
    averagePerformance,
    highestPerformance: highestAgent.score,
    lowestPerformance: lowestAgent.score,
    highestAgent,
    lowestAgent,
  };
};

export const formatSLAData = (rawData) => {
  const dateMap = {};

  rawData.forEach((item) => {
    const createdDate = new Date(item.created_at);
    const day = createdDate.toISOString().split('T')[0];
    const formattedDate = new Date(createdDate)
      .toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
      .replace(/,/g, '');

    if (!dateMap[formattedDate]) {
      dateMap[formattedDate] = {
        date: formattedDate,
        fall: 0,
        offline: 0,
        total: 0,
        compliant: 0,
      };
    }

    const eventMap = {
      2: 'fall',
      5: 'offline',
    };

    const alertType = eventMap[item.event];

    if (alertType) {
      dateMap[formattedDate][alertType]++;
    }
    dateMap[formattedDate].total++;

    if (item.sla_status === 'compliant' || item.sla_status === true) {
      dateMap[formattedDate].compliant++;
    }
  });

  return Object.values(dateMap)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((dayData) => ({
      date: dayData.date,
      fall: dayData.fall,
      offline: dayData.offline,
      percent:
        dayData.total > 0 ? `${Math.round((dayData.compliant / dayData.total) * 100)}%` : '0%',
    }));
};
