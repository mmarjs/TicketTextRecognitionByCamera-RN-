import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default class ContactScreen extends Component {
  static navigationOptions = {
    title: 'Recognition Result'
  }

  constructor(props){
    super(props)
    const { navigation } = this.props
    const text  = navigation.getParam('text')
    const lines = text.match(/[^\r\n]+/g)

    this.state = {
      text: text,
      lines: lines,
      contact: {
        familyName: null,
        givenName: null,
        phoneNumbers: [],
        emailAddresses: [],
        company: null
      },

      lineTypes: [
        {label: 'Last Name', value: 'familyName'},
        {label: 'First Name', value: 'givenName'},
        {label: 'Phone Number', value: 'phoneNumbers'},
        {label: 'Email Address', value: 'emailAddresses'},
        {label: 'Company', value: 'company'}
      ]
    }

    this.selectedType = this.selectedType.bind(this)
  }

  selectedType(type, value) {
    var updatedContact = Object.assign({}, this.state.contact)

    if (type == 'phoneNumbers') {
      updatedContact[type].push({label: "mobile", number: value.replace(/ /g,'')})
    } else if (type == 'emailAddresses'){
      updatedContact[type].push({label: "work", email: value.replace(/ /g,'')})
    } else {
      updatedContact[type] = value
    }

    this.setState({contact:updatedContact});
  }

  render() {
    console.log('state', this.state)
    return (
      <View style={{ flex:1 }}>
        <ScrollView style={styles.container}>
          {
            this.state.lines.map((line, index) => {
              return (
                <View style={styles.lineContainer} key={index}>
                  <Text style={styles.lineText}>{line}</Text>
                  <View style={styles.lineType}>
                    <RNPickerSelect
                      placeholder={{
                          label: 'Select type or nothing to discard',
                          value: null
                      }}
                      onValueChange={(type) => this.selectedType(type, line)}
                      items={this.state.lineTypes}
                      style={styles.picker}
                    />
                  </View>
                </View>
              )
            })
          }
        </ScrollView>
        <TouchableOpacity
          style={styles.saveButton}
        >
          <Text>Save Contact</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  lineContainer: {
    flex: 1,
    borderColor: '#666666',
    borderWidth: 1,
    padding: 10
  },
  picker: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'black',
  },
  saveButton: {
    alignContent: 'center',
    alignSelf: 'center',
    paddingVertical: 15
  }
});
