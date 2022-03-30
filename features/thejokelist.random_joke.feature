# 
#  thejokelist.random_joke.feature
#  by Chris DeFreitas
#

Feature: Random Joke

  Scenario: Retrieve a random joke.
    Given the home page is displayed
    And  the question mark is clicked
    Then a new joke appears
