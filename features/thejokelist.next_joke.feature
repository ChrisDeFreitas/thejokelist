# 
#  thejokelist.next_joke.feature
#  by Chris DeFreitas
#

Feature: Next Joke

  Scenario: Retrieve the next joke by joke.id.
    Given the home page is displayed
    And  the Right Arrow is clicked
    Then the next joke with an id larger than the last appears
