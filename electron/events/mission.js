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

        let cargoDepotTransactions = [];
        let bountyTransactions = [];

        let completedMissions = {
            wmm: [],
            massacre: [],
            assassination: []
        }
        let acceptedMissions = {
            wmm: [],
            massacre: [],
            assassination: []
        };
        let failedMissions = {
            wmm: [],
            massacre: [],
            assassination: []
        }
        let abandonedMissions = {
            wmm: [],
            massacre: [],
            assassination: []
        }

        missionData[key] = {};

        data.events.forEach(item => {
            const eventTimestamp = new Date(item.timestamp);

            if (eventTimestamp >= twoWeeksAgo && eventTimestamp <= now) {
                switch (item.event) {
                    case 'CargoDepot':
                        cargoDepotTransactions.push(item);
                        break;
                    case 'Bounty':
                        bountyTransactions.push(item);
                        break;
                    case 'MissionAccepted':
                        if (item.Name.includes('Mission_Mining') || 
                        item.Name.includes('Mission_Collect')) {
                            acceptedMissions.wmm.push(item);
                        }
                        
                        if(item.Name.includes('Mission_MassacreWing')) {
                            acceptedMissions.massacre.push(item);
                        }
                        break;
                    case 'MissionCompleted':
                        if (item.Name.includes('Mission_Mining') || 
                        item.Name.includes('Mission_Collect')) {
                            completedMissions.wmm.push(item);
                        }
                        
                        if(item.Name.includes('Mission_MassacreWing')) {
                            completedMissions.massacre.push(item);
                        }
                        break;
                    case 'MissionFailed':
                        if (item.Name.includes('Mission_Mining') || 
                        item.Name.includes('Mission_Collect')) {
                            failedMissions.wmm.push(item);
                        }
                        
                        if(item.Name.includes('Mission_MassacreWing')) {
                            failedMissions.massacre.push(item);
                        }
                        break;
                    case 'MissionAbandoned':
                        if (item.Name.includes('Mission_Mining') || 
                        item.Name.includes('Mission_Collect')) {
                            abandonedMissions.wmm.push(item);
                        }
                        
                        if(item.Name.includes('Mission_MassacreWing')) {
                            abandonedMissions.massacre.push(item);
                        }
                        break;
                    default:
                        break;
                }
            }
        });

        const filteredMissions = filterActiveMissions(acceptedMissions, completedMissions, abandonedMissions, failedMissions);

        let allActiveWmmMissions;
        let allActiveMassacreMissions;
        let allActiveAssassinMissions;
        let allActiveMissions;
        
       
        // Update all WMM missions logic
        if(filteredMissions.wmm.length > 0) {
            allActiveWmmMissions = updateWmmMissions(filteredMissions, cargoDepotTransactions);
        }

        // Update all Massacre missions logic
        if(filteredMissions.massacre.length > 0 && bountyTransactions.length > 0) {
            allActiveMassacreMissions = updateMassacreMissions(filteredMissions, bountyTransactions);
        }

        missionData[key].active = {
            wmm: allActiveWmmMissions ? allActiveWmmMissions.wmm.filter((mission) => mission.ItemsDelivered !== mission.Count) : [],
            massacre: allActiveMassacreMissions ? allActiveMassacreMissions.massacre : []
        }
        missionData[key].completed = {
            wmm: allActiveWmmMissions ? allActiveWmmMissions.wmm.filter((mission) => mission.ItemsDelivered === mission.Count) : [],
            massacre: allActiveMassacreMissions ? allActiveMassacreMissions.massacre : []
        }

        missionData[key].info = journalData[key].info;
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
    const activeMissions = {
        wmm: [],
        massacre: [],
        assassination: []
    };

    // Helper function to check if a mission is active
    const isMissionActive = (acceptedMission, missionType) => {
        return !(
            (completed[missionType] && completed[missionType].some(
                (completedMission) => completedMission.MissionID === acceptedMission.MissionID
            )) ||
            (abandoned[missionType] && abandoned[missionType].some(
                (abandonedMission) => abandonedMission.MissionID === acceptedMission.MissionID
            )) ||
            (failed[missionType] && failed[missionType].some(
                (failedMission) => failedMission.MissionID === acceptedMission.MissionID
            ))
        );
    };

    // Loop through each mission type in the accepted object
    for (let missionType in accepted) {
        activeMissions[missionType] = accepted[missionType].filter((acceptedMission) =>
            isMissionActive(acceptedMission, missionType)
        );
    }

    return activeMissions;
}

function updateWmmMissions(missions, cargoDepotTransactions) {
    return {
        ...missions,
        wmm: missions.wmm.map(acceptedMission => {
        // Find all matching missions in cargoDepotMissions by MissionID
        const matchingMissions = cargoDepotTransactions.filter(
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
}

function updateMassacreMissions(missions, bountyTransactions) {
    if(!bountyTransactions || bountyTransactions.length === 0) return;

    return {
        ...missions,
        massacre: missions.massacre.map(mission => {
            // find mission that has a matching faction of a bounty
            // the massacre data should be mapped like
            // {
            //     "issueFaction": "A Faction",
            //     "targetFaction": "B Faction"
            //     "totalKills": 34,
            //     "killsLeft": 20
            //     "missions": []
            // }
            const relatedBounties = bountyTransactions.filter(bounty => bounty.VictimFaction === mission.TargetFaction)
        })
    }
}

module.exports = {
    getMissionDetails,
    filterActiveMissions,
}