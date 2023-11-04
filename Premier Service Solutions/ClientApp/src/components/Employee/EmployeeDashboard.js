import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart } from 'chart.js/auto'
import { useData } from '../DataContext';
import EmployeeDashboardNav from '../Navigation/EmployeeNav/EmployeeDashboardNav';
import "./Employee Styles/EmployeeDashboard.css"

export function EmployeeDashboard() {
    // Access privateData and navigate functions from the DataContext
    const { privateData } = useData();
    const employeeData = privateData.data;
    const navigate = useNavigate();

    const [packageItems, setPackageItems] = useState([]);
    const [mostProfitable, setMostProfitable] = useState({});
    const [leastProfitable, setLeastProfitable] = useState({});
    const [totalPackagesSold, setTotalPackagesSold] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [percentageBusiness, setPercentageBusiness] = useState(0);
    const [percentageStandard, setPercentageStandard] = useState(0);
    const [percentagePremium, setPercentagePremium] = useState(0);
    const [percentageBusinessPromo, setPercentageBusinessPromo] = useState(0);
    const [percentagePremiumPromo, setPercentagePremiumPromo] = useState(0);
    const [packagesSoldByYear, setPackagesSoldByYear] = useState({});
    const [packagesSoldByMonth, setPackagesSoldByMonth] = useState({});

    // Use useEffect to store employee data in local storage when it changes
    useEffect(() => {
        try {
            if (employeeData) {
                localStorage.setItem('employeeData', JSON.stringify(employeeData));
            }
        } catch (error) {
            console.error('Error storing employeeData in local storage:', error);
        }
    }, [employeeData]);

    // Initialize an object to store employee data retrieved from local storage
    let storedEmployeeData = {};

    // Try to retrieve employee data from local storage
    try {
        const storedData = localStorage.getItem('employeeData');
        if (storedData) {
            storedEmployeeData = JSON.parse(storedData);
        }
    } catch (error) {
        console.error('Error retrieving employeeData from local storage:', error);
    }

    // Use the useEffect hook to fetch data when the component mounts
    useEffect(() => { 
        // Fetch package tracking data
        fetch('api/package-tracking')
            .then((response) => response.json())
            .then((data) => {
                // Update state variables with fetched data
                setPackageItems(data);
                setMostProfitable(data.reduce((max, packageItem) => (packageItem.price > max.price ? packageItem : max), data[0]));
                setLeastProfitable(data.reduce((min, packageItem) => (packageItem.price < min.price ? packageItem : min), data[0]));
                setTotalPackagesSold(data.reduce((total, packageItem) => total + packageItem.serviceContractCount, 0));
                setTotalRevenue(data.reduce((total, packageItem) => total + packageItem.serviceContractCount * packageItem.price, 0));
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            }
        );

        // Fetch service contract data
        fetch('api/service-contracts')
            .then((response) => response.json())
            .then((data) => {
                // Year
                const packagesSoldByYear = {};

                // Process service contract data and update the state
                data.forEach((contract) => {
                    const year = new Date(contract.startDate).getFullYear();
                    if (packagesSoldByYear[year]) {
                        packagesSoldByYear[year] += 1;
                    } else {
                        packagesSoldByYear[year] = 1;
                    }
                });
                setPackagesSoldByYear(packagesSoldByYear);

                // Month
                const packagesSoldByMonth = {};

                // Process service contract data by month and package type
                data.forEach((contract) => {
                  const month = new Date(contract.startDate).getMonth();
                  if (packagesSoldByMonth[month]) {
                    packagesSoldByMonth[month][contract.packageId] =
                      (packagesSoldByMonth[month][contract.packageId] || 0) + 1;
                  } else {
                    packagesSoldByMonth[month] = { [contract.packageId]: 1 };
                  }
                });
        
                setPackagesSoldByMonth(packagesSoldByMonth);
            })
            .catch((error) => {
                console.error('Error fetching service contract data:', error);
            }
        );

    }, []);    

    // Define a function to set percentage values based on fetched data
    const setPercentages = () => {
        // Fetch package tracking data again
        fetch('api/package-tracking')
            .then((response) => response.json())
            .then((data) => {
                // Update state variables with calculated percentages
                setPercentageBusiness((data.find((packageItem) => packageItem.packageName === 'Business').serviceContractCount / totalPackagesSold) * 100);
                setPercentageStandard((data.find((packageItem) => packageItem.packageName === 'Standard').serviceContractCount / totalPackagesSold) * 100);
                setPercentagePremium((data.find((packageItem) => packageItem.packageName === 'Premium').serviceContractCount / totalPackagesSold) * 100);
                setPercentageBusinessPromo((data.find((packageItem) => packageItem.packageName === 'Business Promo').serviceContractCount / totalPackagesSold) * 100);
                setPercentagePremiumPromo((data.find((packageItem) => packageItem.packageName === 'Premium Promo').serviceContractCount / totalPackagesSold) * 100);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            }
        );
    };

    // Use the useRef hook to create references to canvas elements
    const canvasRef = useRef(null);
    const canvasRefLineChart = useRef(null);
    const canvasRefGroupedBarChart = useRef(null);

    // Render only when data is available
    if (totalPackagesSold !== 0) {
        // Call the function to set percentage values
        setPercentages();

        // Create a bar chart
        const createBarChart = () => {
            // Get the canvas context
            const ctx = canvasRef.current?.getContext('2d');
        
            if (!ctx) {
                console.error('Canvas context is not available yet.');
                return;
            }
        
            // Destroy the existing Chart instance if it exists
            if (window.myBarChart) {
                window.myBarChart.destroy();
            }
        
            // Define data and options for the bar chart
            const data = {
                labels: ['Standard', 'Business', 'Premium', 'Business Promo', 'Premium Promo'],
                datasets: [
                    {
                        data: [percentageStandard, percentageBusiness, percentagePremium, percentageBusinessPromo, percentagePremiumPromo],
                        backgroundColor: ['#E0393E', '#963D97', '#069CDB', '#5EB344', '#FCB72A'],
                    },
                ]};
        
            const options = {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value, index, ticks) {
                                return value + '%';
                            }
                        },
                        title: {
                            display: true,
                            text: '% Packages Sold',
                            font: {
                                size: 20
                            }
                        },
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Packages',
                            font: {
                                size: 20
                            }
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.raw.toFixed(2)}% Sold`
                            }
                        }
                    }
                }
            };
        
            // Create a new Chart instance
            window.myBarChart = new Chart(ctx, {
                type: 'bar',
                data: data,
                options: options,
            });
        };
        createBarChart();

        // Create line chart for packages sold over the years
        const createLineChart = () => {
            // Get the canvas context for the line chart
            const ctxLineChart = canvasRefLineChart.current?.getContext('2d');
    
            if (!ctxLineChart) {
                console.error('Canvas context for line chart is not available yet.');
                return;
            }

            // Destroy the existing Chart instance if it exists
            if (window.myLineChart) {
                window.myLineChart.destroy();
            }
    
            // Extract years and package counts
            const years = Object.keys(packagesSoldByYear);
            const packageCounts = years.map((year) => packagesSoldByYear[year]);
    
            const dataLineChart = {
                labels: years,
                datasets: [
                    {
                        data: packageCounts,
                        borderColor: '#000',
                        borderWidth: 0.4,
                        backgroundColor: ['#E0393E', '#963D97', '#069CDB', '#5EB344', '#FCB72A'],
                        tension: 0.1,
                    },
                ],
            };
    
            const optionsLineChart = {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Years',
                            font: {
                                size: 20
                            }
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Packages Sold',
                            font: {
                                size: 20
                            }
                        },
                        beginAtZero: true,
                    },
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` Packages Sold: ${context.raw}`
                            }
                        }
                    }
                }
            };
    
            // Create a new Chart instance for the line chart
            window.myLineChart = new Chart(ctxLineChart, {
                type: 'line',
                data: dataLineChart,
                options: optionsLineChart,
            });
        };
        createLineChart();

        // Create a grouped bar chart
        const createGroupedBarChart = () => {
            if (canvasRefGroupedBarChart.current) {
                // Get the canvas context for the grouped bar chart
                const ctxGroupedBarChart = canvasRefGroupedBarChart.current.getContext('2d');
          
                if (!ctxGroupedBarChart) {
                    console.error('Canvas context for grouped bar chart is not available yet.');
                    return;
                }

                // Destroy the existing Chart instance if it exists
                if (window.myGroupedBarGraph) {
                    window.myGroupedBarGraph.destroy();
                }
          
                // Extract months and package types
                const months = Object.keys(packagesSoldByMonth);
                const packageIds = Array.from(
                    new Set(
                        packageItems.map((packageItem) => packageItem.packageId)
                    )
                );

                // Define package colors
                const packageColors = [
                    '#E0393E',
                    '#963D97',
                    '#069CDB',
                    '#5EB344',
                    '#FCB72A'
                ];
          
                // Prepare the data for the chart
                const datasets = packageIds.map((packageId, index) => ({
                    label: packageItems.find((item) => item.packageId === packageId).packageName,
                    data: months.map((month) => packagesSoldByMonth[month][packageId] || 0),
                    backgroundColor: packageColors[index],
                    barThickness: 20,
                }));
          
                const dataGroupedBarChart = {
                    labels: months.map((month) => new Date(0, month).toLocaleString('en-US', { month: 'short' })),
                    datasets: datasets,
                };
          
                // Create a new Chart instance for the grouped bar chart
                window.myGroupedBarGraph = new Chart(ctxGroupedBarChart, {
                    type: 'bar',
                    data: dataGroupedBarChart,
                    options: {
                        scales: {
                            x: {
                                stacked: true,
                                title: {
                                    display: true,
                                    text: 'Months',
                                    font: {
                                        size: 20
                                    }
                                },
                                beginAtZero: true,
                            },
                            y: {
                                stacked: true,
                                title: {
                                    display: true,
                                    text: 'Packages Sold',
                                    font: {
                                        size: 20
                                    }
                                },
                                beginAtZero: true,
                            },
                        },
                    },
                });
              }
        };
        createGroupedBarChart();        

        return (
            <>
                {storedEmployeeData.firstName !== null ? (
                    <>
                        <EmployeeDashboardNav />
                        <div className='package-wrapper'>
                            <div className='package-heading'>
                                <h1><b>Package Tracking</b></h1>
                            </div>

                            <div style={{display: "flex", justifyContent: "center", margin: "1.5em 0", zIndex: "-1"}}><hr style={{width: "20%", zIndex: "-1"}}></hr></div>   

                            {/* Sales Stats */}
                            <div className='chart-wrapper'>
                                <div className='chart-titles'>
                                    <div>
                                        <h2><b>% Packages Sold</b></h2>
                                    </div>
                                    <div>
                                        <h5>Total Packages Sold: {totalPackagesSold}</h5>
                                    </div>
                                </div>
                                <div className='package-chart'>
                                    <canvas ref={canvasRef} id="bar-chart"></canvas>
                                </div>
                            </div> 

                            <div style={{display: "flex", justifyContent: "center", margin: "3em 0", zIndex: "-1"}}><hr style={{width: "50%", zIndex: "-1"}}></hr></div>                   

                            {/* Package Stats */}
                            <div className="package-list">
                                <div className='revenue-wrapper'>
                                        {packageItems.length > 0 && (
                                            <div class="revenue-stats">
                                                <div className='revenue-heading'>
                                                    <h2><b>Revenue Contributed</b></h2>
                                                </div>
                                                <div class="revenue-group group1">
                                                    <p class="revenue">{(packageItems[0].price * packageItems[0].serviceContractCount).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' })}</p>
                                                    <div class="revenue-bar bar1" style={{height: `${packageItems.length >= 0 ? ((packageItems[0].price * packageItems[0].serviceContractCount) / totalRevenue * 100).toFixed(2): 0}%`}}></div>
                                                    <p class="revenue">Standard</p>
                                                </div>
                                                <div class="revenue-group group2">
                                                    <p class="revenue">{(packageItems[1].price * packageItems[1].serviceContractCount).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' })}</p>
                                                    <div class="revenue-bar bar2" style={{height: `${packageItems.length > 1 ? ((packageItems[1].price * packageItems[1].serviceContractCount) / totalRevenue * 100).toFixed(2) : 0}%`}}></div>
                                                    <p class="revenue">Business</p>
                                                </div>
                                                <div class="revenue-group group3">
                                                    <p class="revenue">{(packageItems[2].price * packageItems[2].serviceContractCount).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' })}</p>
                                                    <div class="revenue-bar bar3" style={{height: `${packageItems.length > 2 ? ((packageItems[2].price * packageItems[2].serviceContractCount) / totalRevenue * 100).toFixed(2) : 0}%`}}></div>
                                                    <p class="revenue">Premium</p>
                                                </div>
                                                <div class="revenue-group group4">
                                                    <p class="revenue">{(packageItems[3].price * packageItems[3].serviceContractCount).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' })}</p>
                                                    <div class="revenue-bar bar4" style={{height: `${packageItems.length > 3 ? ((packageItems[3].price * packageItems[3].serviceContractCount) / totalRevenue * 100).toFixed(2) : 0}%`}}></div>
                                                    <p class="revenue">Business Promo</p>
                                                </div>
                                                <div class="revenue-group group5">
                                                    <p class="revenue">{(packageItems[4].price * packageItems[4].serviceContractCount).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' })}</p>
                                                    <div class="revenue-bar bar5" style={{height: `${packageItems.length > 4 ? ((packageItems[4].price * packageItems[4].serviceContractCount) / totalRevenue * 100).toFixed(2) : 0}%`}}></div>
                                                    <p class="revenue">Premium Promo</p>
                                                </div>
                                            </div>
                                        )}

                                    <div className='donut-wrapper'>
                                        <div>
                                            {packageItems.length > 0 && (
                                                <div className="donut" style={{
                                                "--first": packageItems.length >= 0 ? ((packageItems[0].price * packageItems[0].serviceContractCount) / totalRevenue) : 0,
                                                "--second": packageItems.length > 1 ? ((packageItems[1].price * packageItems[1].serviceContractCount) / totalRevenue) : 0,
                                                "--third": packageItems.length > 2 ? ((packageItems[2].price * packageItems[2].serviceContractCount) / totalRevenue) : 0,
                                                "--fourth": packageItems.length > 3 ? ((packageItems[3].price * packageItems[3].serviceContractCount) / totalRevenue) : 0,
                                                "--fifth": packageItems.length > 4 ? ((packageItems[4].price * packageItems[4].serviceContractCount) / totalRevenue) : 0
                                                }}>
                                                    <div className="donut__slice donut__slice__first"></div>
                                                    <div className="donut__slice donut__slice__second"></div>
                                                    <div className="donut__slice donut__slice__third"></div>
                                                    <div className="donut__slice donut__slice__fourth"></div>
                                                    <div className="donut__slice donut__slice__fifth"></div>
                                                    <div className="donut__label">
                                                        <div className="donut__label__heading">
                                                        Total Revenue: <br />{totalRevenue.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div class="info">
                                            <div className='most-prof'>
                                                <p className='info-heading'><b>Most Profitable Package</b></p>
                                                <p className='info-pkg-type'><b>Package Type:</b> {mostProfitable.packageName}</p>
                                                <p className='info-pkg-price'><b>Price:</b> {mostProfitable.price.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' })}</p>
                                            </div>

                                            <div className='least-prof'>
                                                <p className='info-heading'><b>Least Profitable Package</b></p>
                                                <p className='info-pkg-type'><b>Package Type:</b> {leastProfitable.packageName}</p>
                                                <p className='info-pkg-price'><b>Price:</b> {leastProfitable.price.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>  

                            <div style={{display: "flex", justifyContent: "center", margin: "3em 0", zIndex: "-1"}}><hr style={{width: "50%", zIndex: "-1"}}></hr></div> 

                            <div className='chart-wrapper'>
                                <div className='chart-titles'>
                                    <div>
                                        <h2><b>Packages Sold In Each Year</b></h2>
                                    </div>
                                    <div>
                                        <h5>Total Packages Sold: {totalPackagesSold}</h5>
                                    </div>
                                </div>
                                <div className='package-chart'>
                                    <canvas ref={canvasRefLineChart} id="line-chart"></canvas>
                                </div>
                            </div>    

                            <div style={{display: "flex", justifyContent: "center", margin: "3em 0", zIndex: "-1"}}><hr style={{width: "50%", zIndex: "-1"}}></hr></div> 

                            <div className='chart-wrapper'>
                                <div className='chart-titles'>
                                    <div>
                                        <h2><b>Packages Sold In Each Month</b></h2>
                                    </div>
                                    <div>
                                        <h5>Total Packages Sold: {totalPackagesSold}</h5>
                                    </div>
                                </div>
                                <div className='package-chart'>
                                    <canvas ref={canvasRefGroupedBarChart} id="line-chart"></canvas>
                                </div>
                            </div>   
                        </div>
                    </>
                ) : (
                    navigate('/employee-account-setup', { replace: true })
                )}
            </>
        );
    } else {
        return <p>Loading...</p>;
    }   
}