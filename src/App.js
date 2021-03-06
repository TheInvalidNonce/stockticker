import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import { Route, Switch } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import StockList from './components/stocks/StockList'
import StockInfo from './components/stocks/info/StockInfo'
// import Chart from './components/Chart'

class App extends Component {

    state = {
      stocks: ['NVDA', 'TSLA', 'SPOT', 'CSCO', 'AAPL'],
      stocksData: {},
    }

  componentWillMount() {
    if(localStorage.getItem('stocks')) {
      let stocks = JSON.parse(localStorage.getItem('stocks'));
      this.setState({ stocks })
    }
  }

  componentDidMount() {
    this.fetchStocksData() // fetch stock data on mount
    setInterval(this.fetchStocksData, 2000) // fetch data every 2 seconds
  }

  fetchStocksData = async () => {
    const { stocks } = this.state

    const resp = await axios.get(`https://api.iextrading.com/1.0/stock/market/batch?symbols=${stocks[0]},${stocks[1]},${stocks[2]},${stocks[3]},${stocks[4]}&types=quote,news,logo,chart`)

    this.setState({
      stocksData: resp.data
    })
  }

  updateStocks = (idx, symbol) => {
    let updatedStocks = [...this.state.stocks]
    updatedStocks[idx] = symbol

    this.setState({
      stocks: updatedStocks,
    })

    localStorage.setItem('stocks', JSON.stringify(updatedStocks))
    this.fetchStocksData()

  }

  render() {
    const { stocks, stocksData } = this.state

    return (
      <div className="App">
       <Header />
       {/* <Chart /> */}
        <main>
          <Switch>
            <Route exact path='/' 
              render={ () => (
                <StockList 
                  stocks={stocks} 
                  stocksData={stocksData}
                  updateStocks={this.updateStocks}
                />
              )}
            />

            <Route exact path='/:symbol' 
              render={ props => (
                <StockInfo 
                  symbol={props.match.params.symbol} 
                  stockData={stocksData[props.match.params.symbol]}
                />
              )}
            />
          </Switch>
        </main>
        <Footer />
      </div>
    );
  }
}

export default App
