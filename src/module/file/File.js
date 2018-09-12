/**
 * kintone api - nodejs client
 * File module
 */

'use-strict';

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const {KintoneAPIException, Connection} = require('kintone-basejs-sdk');

const FileModule = require('kintone-basejs-sdk').File;

const USER_AGENT = 'User-Agent';
const USER_AGENT_BASE_VALUE = '{name}/{version}';
/**
 * File module for NodeJS
 */
class File extends FileModule {
  /**
     * The constructor for this module
     * @param {Connection} connection
     */
  constructor(connection) {
    if (!(connection instanceof Connection)) {
      throw new Error(`${connection}` +
                  `not an instance of kintoneConnection`);
    }
    // set default user-agent
    connection.setHeader(USER_AGENT,
      USER_AGENT_BASE_VALUE
        .replace('{name}', process.env.npm_package_name || 'kintone-nodejs-sdk')
        .replace('{version}', process.env.npm_package_version || '(none)')
    );
    super(connection);
  }
  /**
     * Download file from kintone
     * @param {String} fileKey
     * @return {Promise}
     */
  download(fileKey, outPutFilePath) {
    const downloadFile = super.download(fileKey)
      .then((fileContent) => {
        try {
          const options = {
            encoding: 'utf16le'
          };
          fs.writeFileSync(outPutFilePath, fileContent, options);
        } catch (err) {
          throw new KintoneAPIException(err);
        }
      });
    return downloadFile;
  }
  /**
     * Upload file from local to kintone environment
     * @param {String} filePath
     * @return {Promise}
     */
  upload(filePath) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath), path.basename(filePath));
    return super.upload(formData);
  }
}
module.exports = File;
