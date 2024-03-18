import React from 'react';
import { Page, Document, StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
  
  },
  tableRow: { 
    flexDirection: 'row', 
  rowGap:20,
  
},
  tableCellHeader: {
    margin: 5,
    fontSize: 9,
    fontWeight: 'bold',
   
    textAlign: 'center',
    width:150,
  },
  tableCell: {
    margin: 2,
    fontSize: 7,
    textAlign: 'center',
    flex:1,
    width:100
  },
});

const PdfContent = ({ data }) => {
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>Student Level Comparison</Text>
        </View>
        <View style={styles.table}>
          <View style={[styles.tableRow]}>
           
            <Text style={styles.tableCellHeader}>Serial No</Text>
            <Text style={styles.tableCellHeader}>Class</Text>
            <Text style={styles.tableCellHeader}>Subject</Text>
            <Text style={styles.tableCellHeader}> Name</Text>
           
            <Text style={styles.tableCellHeader}>Selected Month</Text>
           
            <Text style={styles.tableCellHeader}>Level1</Text>
            <Text style={styles.tableCellHeader}>Curent Month</Text>
            <Text style={styles.tableCellHeader}>Level2</Text>
          </View>
          {data?.map((entry) => (
            <View key={entry.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{entry.id}</Text>
              <Text style={styles.tableCell}>{entry.class_id}</Text>
              <Text style={styles.tableCell}>{entry.subject}</Text>
              <Text style={styles.tableCell}>{entry.student_name}</Text>
            
              <Text style={styles.tableCell}>{entry.month1}</Text>
              
              <Text style={styles.tableCell}>{entry.level1}</Text>
              
              <Text style={styles.tableCell}>{entry.level2}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default PdfContent;
