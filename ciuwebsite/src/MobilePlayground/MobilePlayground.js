// This is going to be the screen in the mobile app which will contain the coding playground. It will utilize React Native
// web in order to contain all of the code that is used in the app
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native-web";
import strings from "../config/strings";
import fontStyles from "../config/fontStyles";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "./MobilePlaygroundStyle.css";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import firebase from "firebase";
import "firebase/functions";
import CompilerLanguages from "../config/CompilerLanguages";

// Initializes firebase
firebase.initializeApp({
  apiKey: "AIzaSyAuPVR7ZPOMddAQX2_asx0VsOLpTlfF4NU",
  authDomain: "coding-is-us.firebaseapp.com",
  databaseURL: "https://coding-is-us.firebaseio.com",
  projectId: "coding-is-us",
  storageBucket: "coding-is-us.appspot.com",
  messagingSenderId: "234463436871",
  appId: "1:234463436871:web:4cdebed85b0ecc0d2d1162",
  measurementId: "G-YD5RKZX6KZ",
});

// Creates the functional component
const MobilePlayground = () => {
  // The state of the code being entered and the language selected. Also the loading state
  const [isCompiling, setIsCompiling] = useState(false);
  const [languageSelected, setLanguageSelected] = useState(
    CompilerLanguages[0]
  );
  const [languageSelectedDropdown, setLanguageSelectedDropdown] = useState(
    CompilerLanguages[0]
  );
  const [code, setCode] = useState(CompilerLanguages[0].template);
  const [output, setOutput] = useState("");

  // Returns the UI of the screen
  return (
    <div className="container">
      <div className="headerStyle">
        <Text style={{ ...fontStyles.longTitleTextStyle, ...fontStyles.white }}>
          {strings.Playground}
        </Text>
      </div>
      <div className="dropdownContainer">
        <Dropdown
          controlClassName={"controlClassName"}
          menuClassName={"controlClassName"}
          options={CompilerLanguages}
          onChange={(value) => {
            const newLanguageSelected = CompilerLanguages.find(
              (eachLangauage) => {
                return eachLangauage.value === value.value;
              }
            );
            setLanguageSelected(newLanguageSelected);
            setCode(newLanguageSelected.template);
            setLanguageSelectedDropdown(value.value);
          }}
          value={languageSelectedDropdown}
        />
      </div>
      <div className="typeCodeBelowTextContainer">
        <Text style={{ ...fontStyles.biggerTextStyle, ...fontStyles.black }}>
          {strings.TypeYourCodeBelow}
        </Text>
      </div>
      <div className="codeEditorContainer">
        <AceEditor
          className={"editorStyle"}
          width={"100vw"}
          fontSize={"3.25vw"}
          height={"20vh"}
          mode={languageSelected.editorMode}
          value={code}
          theme="monokai"
          onChange={(newCode) => setCode(newCode)}
        />
      </div>
      <div className="typeCodeBelowTextContainer">
        <Text style={{ ...fontStyles.biggerTextStyle, ...fontStyles.black }}>
          {strings.Output}
        </Text>
      </div>
      <input
        className="outputStyle"
        multiline={true}
        value={output}
        editable={true}
      />
      <button
        disabled={isCompiling}
        className="runCodeButton"
        onClick={async () => {
          setIsCompiling(true);
          setOutput(strings.Compiling);
          const compiledOutput = (
            await firebase.functions().httpsCallable("runCode")({
              code,
              languageID: languageSelected.compilerID,
            })
          ).data;
          setOutput(compiledOutput);
          setIsCompiling(false);
        }}
      >
        <Text style={{ ...fontStyles.biggerTextStyle, ...fontStyles.white }}>
          {strings.RunCode}
        </Text>
      </button>
    </div>
  );
};

// Exports the playground
export default MobilePlayground;
