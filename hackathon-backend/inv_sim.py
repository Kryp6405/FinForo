import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model
from keras.initializers import Orthogonal

def get_predicted_data(company, money):
    def fetch_historical_data(ticker):
        end_date = datetime(2024,5,16)
        start_date = end_date - timedelta(days=365*2)
        stock = yf.Ticker(ticker)
        hist = stock.history(start=start_date, end=end_date)
        return hist

    def calculate_investment_value(hist, initial_amount):
        initial_price = hist['Close'][0]
        shares = initial_amount / initial_price
        hist['Investment Value'] = hist['Close'] * shares
        return hist

    def create_dataset(dataset, time_step=1):
        dX, dY = [], []
        for i in range(len(dataset)-time_step-1):
            a = dataset[i:(i+time_step), 0]
            dX.append(a)
            dY.append(dataset[i + time_step, 0])
        return np.array(dX), np.array(dY)

    df = fetch_historical_data(company)
    #df2 = df.reset_index()['Close']
    df3 = calculate_investment_value(df, money)
    df3 = df.reset_index()['Investment Value']

    scaler = MinMaxScaler(feature_range=(0,1))
    df4 = scaler.fit_transform(np.array(df3).reshape(-1,1))

    train_size = int(len(df4) * 0.7)
    test_size = len(df4) - train_size
    train_data, test_data = df4[0:train_size,:], df4[train_size:len(df4),:1]

    time_step = 70
    X_train, Y_train = create_dataset(train_data, time_step)
    X_test, Y_test = create_dataset(test_data, time_step)

    X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
    X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)

    custom_objects = {'Orthogonal': Orthogonal()}
    if company == 'TSLA':
        model = load_model('C:\\Users\\golde\Documents\\AIML Workspace\\FinForo-ML\\hackathon-backend\\models\\tesla_prediction.keras', custom_objects=custom_objects)
    elif company == 'GOOGL':
        model = load_model('C:\\Users\\golde\Documents\\AIML Workspace\\FinForo-ML\\hackathon-backend\\models\\google_prediction.keras', custom_objects=custom_objects)
    elif company == 'AMZN':
        model = load_model('C:\\Users\\golde\Documents\\AIML Workspace\\FinForo-ML\\hackathon-backend\\models\\amazon_prediction.keras', custom_objects=custom_objects)
    elif company == 'AAPL':
        model = load_model('C:\\Users\\golde\Documents\\AIML Workspace\\FinForo-ML\\hackathon-backend\\models\\apple_prediction.keras', custom_objects=custom_objects)
    elif company == 'SPOT':
        model = load_model('C:\\Users\\golde\Documents\\AIML Workspace\\FinForo-ML\\hackathon-backend\\models\\spotify_prediction.keras', custom_objects=custom_objects)

    train_predict = model.predict(X_train)
    test_predict = model.predict(X_test)

    train_predict2 = scaler.inverse_transform(train_predict)
    test_predict2 = scaler.inverse_transform(test_predict)

    look_back = 70

    trainPredictPlot = np.empty_like(df4)
    trainPredictPlot[:,:] = np.nan
    trainPredictPlot[look_back:len(train_predict2)+look_back,:] = train_predict2

    testPredictPlot = np.empty_like(df4)
    testPredictPlot[:,:] = np.nan
    testPredictPlot[len(train_predict)+(look_back*2)+1:len(df4)-1,:] = test_predict2

    x_input=test_data[len(test_data)-look_back:].reshape(1,-1)

    temp_input = list(x_input)
    temp_input = temp_input[0].tolist()

    lst_output = []
    n_steps = 70
    i = 0

    while(i < 30):
        if(len(temp_input) > 70):
            x_input = np.array(temp_input[1:])
            #print(f"{i} day input {x_input}")
            x_input = x_input.reshape(1,-1)
            x_input = x_input.reshape((1, n_steps, 1))
            y_pred = model.predict(x_input, verbose=0)
            #print(f"{i} day input {y_pred}")
            temp_input.extend(y_pred[0].tolist())
            temp_input = temp_input[1:]
            lst_output.extend(y_pred.tolist())
            i += 1
        else:
            x_input = x_input.reshape((1, n_steps, 1))
            y_pred = model.predict(x_input, verbose=0)
            #print(y_pred[0])
            temp_input.extend(y_pred[0].tolist())
            #print(len(temp_input))
            lst_output.extend(y_pred.tolist())
            i += 1

    day_new = np.arange(1,71)
    day_pred = np.arange(71,101)

    df5 = df4.tolist()
    df5.extend(lst_output)

    df3_three_months = df3[len(df3)-91:]
    df6 = scaler.inverse_transform(df5[432:])

    return df3_three_months, df6