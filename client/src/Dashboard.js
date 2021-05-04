import React, {  PureComponent ,useDebugValue, useState, useEffect} from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {DropzoneArea} from 'material-ui-dropzone';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Cookies from 'js-cookie'
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import useStyles from './Styles/useStyles';

import {
    Chart,
    BarSeries,
    Title,
    ArgumentAxis,
    ValueAxis,
 Legend as LegendDev
  
  } from '@devexpress/dx-react-chart-material-ui';

  import { Stack,Animation } from '@devexpress/dx-react-chart';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import {
    Root,Label}
    from './Styles/styling';


import DateRangeIcon from '@material-ui/icons/DateRange';



import topfiles from './API/topfiles';
import topusers from './API/topusers';


const DashbooardForm = (props)=>
{
  
   
    const [clickedItem,setClickedItem]=useState('DayTrend');
    const useStylesBootstrap = makeStyles((theme) => ({
      arrow: {
        color: theme.palette.common.black,
      },
      tooltip: {
        backgroundColor: theme.palette.common.black,
      },
    }));

    function BootstrapTooltip(props) {
      const classes = useStylesBootstrap();
    
      return <Tooltip arrow classes={classes} {...props} />;
    }

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="custom-tooltip">
            <p className="tooltipstyle">{`${label} : ${payload[0].value}`}</p>
           
          </div>
        );
      }
    
      return null;
    };
    
    const handleDayTrendClick=()=>{
       
        setClickedItem('DayTrend');
      
     }
  
     const handleHourTrendClick=()=>{
     
      
        setClickedItem('HourTrend');
    }

    const mainListItems = (
        <div>
          <ListItem button onClick={handleDayTrendClick}  >
            <ListItemIcon >
            <BootstrapTooltip title ="Day Trend" ></BootstrapTooltip>
            <DateRangeIcon />
            </ListItemIcon>
            <ListItemText primary="Day Trend" />
          </ListItem>
          <ListItem button onClick={handleHourTrendClick} >
            <ListItemIcon>
            <BootstrapTooltip title ="Hourly Trend"  ></BootstrapTooltip>
            <HourglassEmptyIcon />
            </ListItemIcon>
            <ListItemText primary="Hourly Trend" />
          </ListItem>
         
        </div>
      );

const classes = useStyles();
const [file, setFile] = useState(props.file);
const [chartData, setChartData] = useState([]);
const [monthlyData, setMonthlyData] = useState([]);
const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];
const [hourlyData, setHourlyData] = useState([]);
const [month,setMonth]=useState([4]);
const [year,setYear]=useState([2013]);
const [fileNames,setFileNames]=useState();
const [hourlyTopFiles, setHourlyTopFiles] = useState([]);
const [monthlyTopFiles, setMonthlyTopFiles] = useState([]);
const [hourlyTopUsers, setHourlyTopUsers] = useState([]);
const [monthlyTopUsers, setMonthlyTopUsers] = useState([]);
const [selectedDate,setSelectedDate]=useState('2013-05-24');
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);


//   to upload new file and call API 
  const handleChange=files=>{
    // var _ = require("underscore");

    var calendarDate=new Date(selectedDate);
    
    setFile(files);
    if(files[0]!=null)
     {
       const formData=new FormData();
       formData.append('files',files[0]);
      
       fetch("http://localhost:3001/inputAPI/files", {
          method: 'POST',
          body: formData,
          credentials: 'include',
      

        }).then(resp => {
          setFileNames(Cookies.get('filename'));
          
          return resp.json()
        }).then(data => {  
            //   from API response, it filters records for this month and hour for widgets. 
            //  also populates top 5 filenames and usernames for month and hour
            setMonth(calendarDate.getMonth());
            setYear(calendarDate.getFullYear());
            var monthfiltered = data.filter(d=>d.year===calendarDate.getFullYear()&&d.month===monthNames[calendarDate.getMonth()]);
            setChartData(data);
            setMonthlyData(monthfiltered);
            var filtered = monthfiltered.filter(d=>d.year===calendarDate.getFullYear()&&d.month===monthNames[calendarDate.getMonth()]&&d.date===calendarDate.getDate());
            
            setHourlyData(filtered);
            
            TrendingFilesandUsersHour();
            TrendingFilesandUsersMonth();
          });
      
     }

  
  }

          // Populates top 5 filenames and usernames for month 
  const TrendingFilesandUsersMonth=()=>{

    var calendarDate=new Date(selectedDate);

    
    var response2 = new Promise((resolve, reject) => {
      resolve(topfiles(undefined,calendarDate.getMonth(),calendarDate.getFullYear(),Cookies.get('filename')));
    }).then(value=>{
      setMonthlyTopFiles(value);
    });

  
    var response2 = new Promise((resolve, reject) => {
      resolve(topusers(undefined,calendarDate.getMonth(),calendarDate.getFullYear(),Cookies.get('filename')));
    }).then(value=>{
      setMonthlyTopUsers(value);
    });

  }

        // Populates top 5 filenames and usernames for hour 
  const TrendingFilesandUsersHour=()=>{

      var calendarDate=new Date(selectedDate);

      var response2 = new Promise((resolve, reject) => {
        resolve(topfiles(calendarDate.getDate(),calendarDate.getMonth(),calendarDate.getFullYear(),Cookies.get('filename')));
      }).then(value=>{
        setHourlyTopFiles(value);
      });
   

      var response2 = new Promise((resolve, reject) => {
        resolve(topusers(calendarDate.getDate(),calendarDate.getMonth(),calendarDate.getFullYear(),Cookies.get('filename')));
      }).then(value=>{
        setHourlyTopUsers(value);
      });
  }
 
          // Change data based on date selected
  const handleDateChange=event=>{
    setSelectedDate(event.currentTarget.value);
    
    var calendarDate=new Date(selectedDate);
    var monthfiltered = chartData.filter(d=>d.year===calendarDate.getFullYear()&&d.month===monthNames[calendarDate.getMonth()]);
    setMonthlyData(monthfiltered);
   
    var filtered = chartData.filter(d=>d.year===calendarDate.getFullYear()&&d.month===monthNames[calendarDate.getMonth()]&&d.date===calendarDate.getDate());
    setHourlyData(filtered);
    TrendingFilesandUsersHour();
   
    if(calendarDate.getMonth()!=month || calendarDate.getFullYear()!=year)
      TrendingFilesandUsersMonth();
    setMonth(calendarDate.getMonth());
    setYear(calendarDate.getFullYear());

  }


    return (

        
    <div>
    <div className={classes.root}>
      <CssBaseline />
   
      <AppBar position="absolute"  style={{ background: '#00838f' }} className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="black"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
          Securonix Trend Graph
          <div>
          
          </div>
          </Typography>
          <IconButton color="inherit">
            <Badge  color="white">
            <TextField
        id="datetime-local"
        label="Select Date"
        type="date"
        
        value={selectedDate}
        onChange={handleDateChange}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
          
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <DropzoneArea
         
         onChange={handleChange.bind(this)}
         acceptedFiles={['.zip']}
         filesLimit={1}
         />
        <List>{mainListItems}</List>
        <Divider />
      
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} >
       
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
              
              <Paper className={fixedHeightPaper}>
              {clickedItem=='DayTrend'?(
                  <div>
                    <p>

                    <BarChart  width={1000} height={250} data={monthlyData} 
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}>

                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="datekey"  angle={-45} textAnchor="end" />
                      <YAxis color="#ffd700"/>
                      <Tooltip cursor={false}  content={<CustomTooltip/>}  />
                      <Legend />
                      <Bar dataKey="activities" fill="#ffd700" />
                    
                    </BarChart>

                    </p>       
                    <Chart rotated='true'
                    data={monthlyData}

                    >
                    <ArgumentAxis/>
                    <ValueAxis   />

                    <BarSeries
                    name="number of activities"
                        valueField="activities"
                        argumentField="datekey"
                        color="#ffd700"
                    
                    />
                    
                    
                    <Title text="Daywise Activity Trend" />
                    <Animation />
                    <LegendDev position="bottom" rootComponent={Root} labelComponent={Label} />
                    
                    <Stack />
                    </Chart>

                    <div className={classes.chartstyle}>
                      
                    <Box p={1} bgcolor="background.paper">
                   
                    <Box p={1} bgcolor="lightgrey.300">
                    <Chart
                    data={monthlyTopFiles} rotated='true' 
                    >
                    <ArgumentAxis/>
                    <ValueAxis  />

                    <BarSeries
                    name="number of activities"
                        valueField="activities"
                        argumentField="filename"
                        color="#cd7f32"
                    
                    />
                    
                    
                    <Title text="Top 5 Filenames of this Month" />
                    <Animation />
                    <LegendDev position="bottom" rootComponent={Root} labelComponent={Label} />
                    
                    <Stack />
                    </Chart>
                                           
                         
                    </Box>
                    </Box>
                    <Box  p={1} bgcolor="background.paper">
                    <Box p={1}   bgcolor="white.300">
                   
                    <Chart
                    data={monthlyTopUsers} 
                    >
                    <ArgumentAxis/>
                    <ValueAxis  />

                    <BarSeries
                    name="number of activities"
                        valueField="activities"
                        argumentField="username"
                        color="#c0c0c0"
                    
                    />
                    
                    
                    <Title text="Top 5 Users of this Month and  number of their activities" />
                    <Animation />
                    <LegendDev position="bottom" rootComponent={Root} labelComponent={Label} />
                    
                    <Stack />
                    </Chart>
                    </Box>
                    </Box>
                    </div>
                    </div>
              ):
              
              (<div> 
            
          
                    <Chart
                    data={hourlyData}>
                    <ArgumentAxis/>
                    <ValueAxis  />
          
                    <BarSeries
                    name="number of activities"
                      valueField="activities"
                      argumentField="hour"
                      color="#ffd700"
                  
                    />
                  
              
                    <Title text="Activity Trend By Hour" />
                    <Animation />
                    <LegendDev position="bottom" rootComponent={Root} labelComponent={Label} />
                    
                    <Stack />
                    </Chart>
                    <div className={classes.chartstyle}>
                    <Box p={1} bgcolor="background.paper">
                
                    <Box p={1}bgcolor="lightgrey.300">
                    <Chart
                    data={hourlyTopFiles} rotated='true'
                    >
                    <ArgumentAxis/>
                    <ValueAxis  />
            
                    <BarSeries
                    name="number of activities"
                        valueField="activities"
                        argumentField="filename"
                    
                    
                    />
                  
            
                    <Title text="Top Filenames on this Date" />
                    <Animation />
                    <LegendDev position="bottom" rootComponent={Root} labelComponent={Label} />
                    
                    <Stack />
                    </Chart>
                    </Box>
                    </Box>
                    <Box p={1} bgcolor="background.paper">
                        <Box p={1}  bgcolor="white.300">
          
          
                    <Chart
                        data={hourlyTopUsers}
                    >
                        <ArgumentAxis/>
                        <ValueAxis  />

                        <BarSeries
                        name="number of activities"
                        valueField="activities"
                        argumentField="username"
                        color="#c0c0c0"
                    
                        />
                    
                        
                        <Title text="Top 5 Users of this day with their activity count" />
                        <Animation />
                        <LegendDev position="bottom" rootComponent={Root} labelComponent={Label} />
                        
                        <Stack />
                    </Chart>
                 </Box>
            </Box>
            </div></div>)}
              </Paper>
            
            </Grid>
          
          </Grid>
         
        </Container>
        </div>
     
      </main>
    </div>
           
    </div>
    );
};

export default DashbooardForm;