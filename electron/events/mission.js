const { sortJournal } = require('./journal');
const { getState, setState, setCargoState } = require('../data/state');

async function getMissionDetails() {
    const { journalData } = sortJournal();

    let missionData = {};

    const state = getState();

    Object.keys(journalData).forEach((key) => {
        const data = journalData[key];
        const now = new Date();
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(now.getDate() - 14);

        let marketBuyItems = [];
        let cargoDepotMissions = [];
        let completedMissions = [];
        let acceptedMissions = [];
        let failedMissions = [];
        let abandonedMissions = [];

        missionData[key] = {};

        data.events.forEach(item => {
            const eventTimestamp = new Date(item.timestamp);

            if (eventTimestamp >= twoWeeksAgo && eventTimestamp <= now) {
                switch (item.event) {
                    case 'CargoDepot':
                        cargoDepotMissions.push(item);
                        break;
                    case 'MarketBuy':
                        marketBuyItems.push(item);
                        break;
                    case 'MissionAccepted':
                        if (item.Name.includes('Mission_Mining') || item.Name.includes('Mission_Collect')) {
                            acceptedMissions.push(item);
                        }
                        break;
                    case 'MissionCompleted':
                        if (item.Name.includes('Mission_Mining') || item.Name.includes('Mission_Collect')) {
                            completedMissions.push(item);
                        }
                        break;
                    case 'MissionFailed':
                        if (item.Name.includes('Mission_Mining') || item.Name.includes('Mission_Collect')) {
                            failedMissions.push(item);
                        }
                        break;
                    case 'MissionAbandoned':
                        if (item.Name.includes('Mission_Mining') || item.Name.includes('Mission_Collect')) {
                            abandonedMissions.push(item);
                        }
                        break;
                    default:
                        break;
                }
            }
        });
        
        const filteredActiveMissions = filterActiveMissions(acceptedMissions, completedMissions, abandonedMissions, failedMissions);
        const allMissionProgressCheck = updateMissionProgress(filteredActiveMissions, cargoDepotMissions);

        missionData[key].active = allMissionProgressCheck.filter((mission) => mission.ItemsDelivered !== mission.Count);
        missionData[key].completed = allMissionProgressCheck.filter((mission) => mission.ItemsDelivered === mission.Count);
        missionData[key].info = journalData[key].info;
        missionData[key].cargo = state.cargoData?.[key] || [];
    });
    
    if(missionData) {
        Object.keys(missionData).forEach(key => {
            // Remove any broken FIDs
            if (key === 'undefined') {
                delete missionData[key];
                return;
            }
    
              // Check if the mission has an active array
            if (missionData[key].active && Array.isArray(missionData[key].active)) {
                // Filter out expired missions within the active array
                missionData[key].active = missionData[key].active.filter(mission => {
                    if (mission.Expiry) {
                        const expiryDate = new Date(mission.Expiry); // Assuming Expiry is in a valid date format
                        const currentDate = new Date();
                        // Keep only missions that have not expired
                        return expiryDate >= currentDate;
                    }
                    return true; // Keep missions that don't have an Expiry field
                });
            }
        });
    }

    return missionData;
}

function filterActiveMissions(accepted, completed, failed, abandoned) {
    return accepted.filter(
        (acceptedMission) =>
            !completed.some(
                (completedMission) => completedMission.MissionID === acceptedMission.MissionID
            ) &&
            !abandoned.some(
                (abandonedMission) => abandonedMission.MissionID === acceptedMission.MissionID
            ) &&
            !failed.some(
                (failedMission) => failedMission.MissionID === acceptedMission.MissionID
            )
    );
}

function updateMissionProgress(acceptedMissions, cargoDepotMissions) {
    return acceptedMissions.map(acceptedMission => {
        // Find all matching missions in cargoDepotMissions by MissionID
        const matchingMissions = cargoDepotMissions.filter(
            cargoMission => cargoMission.MissionID === acceptedMission.MissionID
        );

        if (matchingMissions.length > 0) {
            // Find the mission with the highest ItemsDelivered value
            const missionWithHighestDelivery = matchingMissions.reduce((max, mission) =>
                mission.ItemsDelivered > max.ItemsDelivered ? mission : max,
                matchingMissions[0]
            );

            // Calculate the progress based on the mission with the highest ItemsDelivered
            const progress = (missionWithHighestDelivery.ItemsDelivered / missionWithHighestDelivery.TotalItemsToDeliver).toFixed(2);

            // Return null if the mission is complete (ItemsDelivered === TotalItemsToDeliver)
            // if (missionWithHighestDelivery.ItemsDelivered === missionWithHighestDelivery.TotalItemsToDeliver) {
            //     return null;
            // }

            return {
                ...acceptedMission,
                Progress: progress,
                ItemsDelivered: missionWithHighestDelivery.ItemsDelivered
            };
        } else {
            // If no match is found, return the mission as is with default progress and delivered items
            return {
                ...acceptedMission,
                Progress: '0.00',
                ItemsDelivered: 0
            };
        }
    })
}

module.exports = {
    getMissionDetails,
    filterActiveMissions,
    updateMissionProgress
}