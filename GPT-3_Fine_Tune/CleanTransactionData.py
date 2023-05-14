import pandas as pd
import re
import time
import numpy as np

# using etherscan API, fetches the transaction and token data for the a list of address
# within a given time period
class CleanTransactionData(object):
    def __init__(self):
        self.df = pd.read_csv('transaction_dataset.csv')

    def get_useful_cols(self):
        useful_cols = ['Address', 'FLAG', 'Avg min between sent tnx',
                         'Avg min between received tnx',
                         'Time Diff between first and last (Mins)', 'Sent tnx', 'Received Tnx',
                         'Number of Created Contracts', 'Unique Received From Addresses',
                         'Unique Sent To Addresses', 'min value received', 'max value received ',
                         'avg val received', 'min val sent', 'max val sent', 'avg val sent',
                         'total Ether sent', 'total ether received', 'total ether balance',
                         ' ERC20 uniq sent addr', ' ERC20 uniq rec addr',
                         ' ERC20 avg time between sent tnx', ' ERC20 avg time between rec tnx',
                         ' ERC20 min val rec',
                         ' ERC20 max val rec', ' ERC20 avg val rec', ' ERC20 min val sent',
                         ' ERC20 max val sent', ' ERC20 avg val sent']
        return useful_cols

    def clean_dataframe(self):
        useful_cols = self.get_useful_cols()
        self.df = self.df[useful_cols]

    def get_cleaned_df(self):
        self.clean_dataframe()
        return self.df

