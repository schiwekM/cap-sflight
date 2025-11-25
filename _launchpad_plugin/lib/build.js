const cds = require('@sap/cds');
const { path, fs } = cds.utils;
const fsPromises = require('fs/promises');


module.exports = class WorkZonePlugin extends cds.build.Plugin {
  static taskDefaults = { src: cds.env.folders.app }
  static hasTask() {
    return true;
  }
  async build() {
    const cdmDir = path.join(this.task.src, 'cdm')
    if (fs.existsSync(cdmDir)) {
      const cdm = []
      await walk(cdm, cdmDir)
      await this.write(cdm).to('cdm.json')
    }
  }
}

async function walk(cdm, cdmDir) {
  const content = await fsPromises.readdir(cdmDir, { withFileTypes: true });
  for (const node of content) {
    if (node.name.split('.').length === 1) {
      await walk(cdm, path.join(cdmDir, node.name))
    } else {
      cdm.push(JSON.parse(await fsPromises.readFile(path.join(cdmDir, node.name), { encoding: 'utf-8' })))
    }
  }
  return cdm;
}