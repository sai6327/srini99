import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  state = {
    selectedFile: null,
    fileUploadedSuccessfully: false,
    error: '',
    downloadButtonVisible: true, // Initially, show the Download Template button
    uploadButtonVisible: false,   // Initially, hide the Upload button
  };

  onFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop().toLowerCase();
      if (fileType === 'csv' || fileType === 'xlsx') {
        this.setState({ selectedFile, error: '', uploadButtonVisible: true });
      } else {
        this.setState({ selectedFile: null, error: 'Please select a CSV or XLSX file.' });
      }
    }
  };

  onFileUpload = () => {
    const { selectedFile } = this.state;
    if (selectedFile) {
      const formData = new FormData();
      formData.append('demo file', selectedFile, selectedFile.name);

      axios
        .post('https://mzdai0st3i.execute-api.us-east-1.amazonaws.com/dev/file-upload', formData)
        .then(() => {
          this.setState({ selectedFile: null, fileUploadedSuccessfully: true, uploadButtonVisible: false });
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    }
  };

  onDownloadTemplate = () => {
    // Replace 'template_url' with the actual URL of your template file.
    const xlsxFileUrl = 'chatbot.xlsx'; // Use the file name and path relative to the public directory
    window.open(xlsxFileUrl, '_blank');

    // After downloading the template, hide the Download Template button and show the Choose File input.
    this.setState({ downloadButtonVisible: false, uploadButtonVisible: true });
  };

  render() {
    return (
      <div className="app-container">
        <div className="outlined-box">
          <div className="header-box">
            <h1 className="highlight-text">ConnectGenUS</h1>
          </div>
          <h3>File Upload with React and a serverless API</h3>
          <div className="info-box">
            {this.state.selectedFile && (
              <div>
                <h2>File Details:</h2>
                <p>File Name: {this.state.selectedFile.name}</p>
                <p>File Type: {this.state.selectedFile.type}</p>
                <p>Last Modified: {new Date(this.state.selectedFile.lastModified).toDateString()}</p>
                {this.state.uploadButtonVisible && (
                  <div className="button-box">
                    <button onClick={this.onFileUpload}>Upload</button>
                  </div>
                )}
              </div>
            )}
            {this.state.fileUploadedSuccessfully ? (
              <div>
                <br />
                <h4>Your File has been Uploaded Successfully</h4>
              </div>
            ) : (
              <div>
                {this.state.downloadButtonVisible && (
                  <div className="button-box">
                    <button onClick={this.onDownloadTemplate}>Download Template</button>
                  </div>
                )}
                {!this.state.selectedFile && this.state.uploadButtonVisible && (
                  <div className="input-box">
                    <input type="file" accept=".csv, .xlsx" onChange={this.onFileChange} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;