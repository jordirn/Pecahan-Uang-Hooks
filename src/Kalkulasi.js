import React, { useState, memo } from 'react'
import PropTypes from 'prop-types'

const Index = props => {
  const [ amount, setAmount ] = useState('')
  const [ amountLeft, setAmountLeft ] = useState(null)
  const [ , setProcess ] = useState(false)
  const [ error, setError ] = useState('')
  const [ result, setResult ] = useState([])

  const handleChange = event => {
    setAmount(event.target.value)
  }

  const _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      processMoney()
    }
  }

  const processMoney = () => {
    setProcess(true)
    setAmountLeft(null)
    setResult([])
    setError('')

    const fractions = [100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100]
    let amountMoney = parseInt(amount)
    let temp = []
    let result = []

    const validation = validationAmount(amount)

    if (validation) {
      amountMoney = validation

      while (amountMoney >= 50) {
        for (var i = 0; i < fractions.length; i++) {
          if (amountMoney >= fractions[i]) {
            temp[fractions[i]] = temp[fractions[i]] ? temp[fractions[i]] + 1 : 1
            amountMoney = amountMoney - fractions[i]
            break
          }
        }
      }

      let resultOrder = temp.length - 1
      temp.forEach((value, key) => {
        result[resultOrder] = { money: key, total: value }
        resultOrder--
      })

      setAmountLeft(amountMoney)
      setResult(result)
    }

    setProcess(false)
  }

  const validationAmount = (amount) => {
    amount = amount.toLowerCase()

    if (amount.indexOf('rp') > -1) {
      const rpSplit = amount.split('rp')

      if (rpSplit[0].replace(/\s+/g, '') === '' && rpSplit[rpSplit.length - 1].replace(' ', '') === '') {
        setError('Missing value!')
        return false
      } else if (rpSplit[rpSplit.length - 1].replace(/\s+/g, '') === '') { // check if Rp is wrong position
        setError('Valid character in wrong position!')
        return false
      } else {
        amount = rpSplit[1].replace(/\s+/g, '')
      }
    }
    if (amount.indexOf('.') > -1) {
      amount = amount.replace('.', '')
    }

    if (amount.indexOf(',') > -1 || amount.indexOf(' ') > -1) {
      if (amount.split(',')[1] !== '00') {
        setError('Invalid separator!')
        return false
      }
    }

    return parseInt(amount)
  }

  return (
    <div css={Homepage}>
      <div className="topHeader">
        <Typography className="title" component="h2" variant="h1" gutterBottom>
           Rupiah Denominations
        </Typography>
      </div>
      <Grid container spacing={8}>
        <Grid item xs={9}>
          <TextField
            label="Amount"
            value={amount}
            onChange={handleChange}
            onKeyPress={_handleKeyPress}
            margin="normal"
            error={Boolean(error)}
            helperText={error}
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={amount === ''}
            onClick={processMoney}
            style={{ marginTop: 30 }}
          >
              Process
          </Button>
        </Grid>
      </Grid>

      <App data={result} amountLeft={amountLeft} />
    </div>
  )
}

Index.propTypes = {
  classes: PropTypes.object.isRequired
}

export default memo(Index)
