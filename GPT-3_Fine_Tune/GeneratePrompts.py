from CleanTransactionData import CleanTransactionData
import pandas as pd

class GeneratePrompts(object):
    def __init__(self):
        self.df = CleanTransactionData().get_cleaned_df()
        self.prompt_df = pd.DataFrame()

    def generate_prompts(self):
        print("generating prompts")
        useful_cols = [col for col in self.df.columns if col != "FLAG"]
        for index, row in self.df.iterrows():
            # Generate the prompt string
            prompt = ", ".join([str(row[col]) for col in useful_cols]) + " -> "

            # Get the value of the FLAG column
            completion = row["FLAG"]
            self.prompt_df = pd.concat([self.prompt_df, pd.DataFrame({'prompt': [prompt], 'completion': completion})])
            if index % 100 == 0:
                print(f'Completed {index} prompts')
        self.prompt_df.replace('nan', 0, inplace=True)
        self.prompt_df.to_csv('prompt_data.csv', index=False, header=True)


if __name__ == '__main__':
    GeneratePrompts().generate_prompts()
    #ft-sowHSSMQZU4Yn1mf0m0PlnNx -> ada
    #ft-N4A9ctc4TuDcq0ojp5WWmGjM -> curie