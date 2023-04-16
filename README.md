# Genesis

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

# Requirements

## komponent powinien mieć możliwość wyboru czy tabelka będzie zawierała paginację czy wszystkie dane będą wyświetlane jednocześnie

The top-right side of the page containse button "Change View". 
Click on it and change the view (List view by default).

## dodatkowo dla opcji wyświetlania wszystkich danych jednocześnie należy zastosować mechanizm optymalizacyjny, żeby wyświetlenie 10 000 wierszy tabeli nie spowalniało przeglądarki

At the bottom of the page, you can find the button "Load more". 
Click on it and load additional 20 items. If the elements run out, the button will disappear.

## wyświetlana tabelka powinna być responsywna (dla mniejszych ekranów można zrezygnować z wyświetlania pewnych kolumn - to też może być zdefiniowane w przekazywanych do komponentu danych)

The page has a responsive design (up to 375px).
Weight property will be hidden as an example from 480px and less.

## komponent powinien informować rodzica o tym kiedy "załaduje" wszystkie dane do tabeli (można zasymulować ładowanie danych z API jakimś timeoutem i wyświetlić progressbar)

The page has a loader that is waiting for the response result.
In addition, shareReplay() was added for preventing multiple calls of the getRegion() method

## wskazane będzie użycie Material Design do budowania tabelki, progressbara oraz innych elementów komponentu

Table, buttons, and paginator use Angular Material

## dodatkowo zakładamy, że dane wejściowe to dane z API, które pochodzą z formularzy i nigdy nie ma pewności, że użytkownik je poprawnie uzupełnił (dane powinny być odpowiednio zabezpieczone przed wyświetleniem niepowołanego kodu JavaScript, HTML, null, undefined, etc.)

Angular Material table protects such issues by default.
