const path = require('path');
const fs = require('fs');

function readJournalDir() {
    return path.join(
        process.env.HOME || process.env.USERPROFILE || '',
        'Saved Games',
        'Frontier Developments',
        'Elite Dangerous'
    );
}

function sortJournal() {
    let journalData = {};
    const journalDir = readJournalDir();
    const files = readJournalFiles();

    files.forEach((file) => {
        const fileData = fs.readFileSync(path.join(journalDir, file), 'utf-8');
        const entries = fileData.split('\n');
        let fid;

        // Find the Commander FID for this file
        const cmdrEntry = entries.find(entry => {
            try {
                if(typeof entry === 'string') {
                    const sanitizedEntry = entry.trim().replace(/\r$/, '');

                    if(sanitizedEntry === '') {
                        console.warn('Encountered an empty entry...');
                        return false;
                    }
                    
                    const parsedEntry = JSON.parse(sanitizedEntry);
    
                    if(parsedEntry.event === 'Commander') {
                        return true;
                    }
                }
                return false;
            } catch (error) {
                console.error('Failed to parse entry:', error.message);
                return false;
            }
        });

        if(cmdrEntry) {
            const sanitizedFidEntry = cmdrEntry.trim().replace(/\r$/, '');
            const parsedFidEntry = JSON.parse(sanitizedFidEntry);
            fid = parsedFidEntry.FID;
        }

        // Loop all entries to assign them to the FID.
        entries.forEach((entry) => {
            try {
                if (entry) {
                    const sanitizedEntry = entry.trim().replace(/\r$/, '');
                    const parsedEntry = JSON.parse(sanitizedEntry);
                    const { event } = parsedEntry;

                    if (!journalData[fid]) {
                        journalData[fid] = {
                            events: []
                        };
                    }

                    if (event === 'Commander') {
                        journalData[fid].info = {
                            name: parsedEntry.Name,
                            fid
                        }
                    }

                    switch(event) {
                        case 'LoadGame':
                            journalData[fid].info = {
                                ...journalData[fid].info,
                                ship: parsedEntry.Ship_Localised,
                                credits: parsedEntry.Credits
                            }
                            break;
                        case 'ShipyardSwap':
                            journalData[fid].info = {
                                ...journalData[fid].info,
                                ship: parsedEntry.ShipType_Localised,
                            }
                            break;
                        case 'Commander':
                            journalData[fid].info = {
                                ...journalData[fid].info,
                                name: parsedEntry.Name
                            }
                            break;
                        case 'Loadout':
                            journalData[fid].info = {
                                ...journalData[fid].info,
                                cargo: parsedEntry.CargoCapacity
                            }
                            break;
                        case 'Credit':
                            console.log('Credits: ', parsedEntry.Credit);
                            break;
                        default:
                            break;
                    }

                    journalData[fid].events.push(parsedEntry);
                }

            } catch (error) {
                console.error(`Failed to parse entry at index:`, error.message);
                console.error(`Entry content: ${entry}`);
            }
        });
    });

    return journalData;
}

function readLastJournalFile() {
    const journalDir = readJournalDir();

    const files = fs.readdirSync(journalDir);

    const lastJournalFile = files
        .filter((file) => file.startsWith('Journal') && file.endsWith('.log'))
        .map((file) => ({
            file,
            mtime: fs.statSync(path.join(journalDir, file)).mtime,
        }))
        .sort((a, b) => b.mtime - a.mtime)[0]?.file;

    if (!lastJournalFile) {
        console.error('No journal files found');
        return;
    }

    return lastJournalFile;
}

function readJournalFiles() {
    const journalDir = readJournalDir();

    const files = fs.readdirSync(journalDir);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 14);

    const journalFiles = files.filter((file) => {
        const filePath = path.join(journalDir, file)
        const stats = fs.statSync(filePath);
        const fileModifiedTime = new Date(stats.mtime);

        return file.startsWith('Journal') && file.endsWith('.log') && fileModifiedTime >= oneWeekAgo;
    });

    return journalFiles;
}

function watchJournalChanges(mainWindow) {
    const journalDir = readJournalDir();

    const lastJournalFile = readLastJournalFile();

    if (lastJournalFile) {
        fs.watch(path.join(journalDir, lastJournalFile), (eventType, filename) => {
            if (eventType === 'change') {
                console.log(`File ${filename} has been updated.`);
                // Notify React of the file change
                if(mainWindow && mainWindow.webContents) {
                    mainWindow.webContents.send('journal-file-updated');
                }
            }
        });
    }
}

module.exports = {
    sortJournal,
    readJournalDir,
    readJournalFiles,
    readLastJournalFile,
    watchJournalChanges
}