renderChart()

function renderChart() {
    const c = document.getElementsByClassName('chart')[0]
    const ctx = c.getContext("2d")
    totalChart(ctx)
}

async function totalChart(ctx) {
    const data = await getData()
    const {fats, carbs, protein, fiber} = data
    const newData = {fats, carbs, protein, fiber}
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(newData),
            datasets: [{
                label: '% Nutrients',
                data: Object.values(newData),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Food Nutrients',
                fontSize: 20,
                //padding: 10,
                fontColor: '#111'
            },
            legend: {
                position: 'top',
                labels: {
                    padding: 5,
                    boxWidth: 15,
                    fontFamily: 'system-ui',
                    fontColor: 'black'
                }

            }
        }
    });
}

async function getData() {
    const address = window.location.pathname.split('/')
    const origin = window.location.origin
    let data = await fetch(`${origin}/${address[1]}/api/${address[2]}`)
    data =  await data.json()
    return data
}




