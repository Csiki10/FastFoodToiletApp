### Feladat specifikáció

Az elkészítendő feladat egy Wc kód menedzselő alkalmazás, melyben a regisztrált és bejelentkezett felhasználó képes új wc kódot felvinni. A felvételnél meg lehet adni képet a helyről, a kódot és címet. Az egyes wc kódokra rákattintva lehet véleményeket felvinni és értékelni. Saját wc kódot és véleményt lehet szerkeszteni és törölni. A saját felvitt kódokhoz tartozó vélemyényeket a kód tulaja is törölheti, mint egy moderátor.
Az alkalmazás Angular használatával fog elkészülni. A megjelenítéshez Angular Material és Tailwind css lesz alkalmazva, saját css-el kiegészítve.
Az oldalak és megjelenítés koncepcióját tekintve a szerveroldai félévesre elkészített alkalmazáshoz hasonló lesz. Onnan csatolok be pár képet.

### Technológia
| Technológia |
| - |
| Angular |
| Angular Material |
| Tailwind |
| Bootstrap |
| MVC backend |

### Funkció lista
| Funkció |
| - |
| Wc kód felvétele |
| Wc kód törlése |
| Wc kód szerkesztése |
| Vélemény felvétele |
| Vélemény törlése |
| Vélemény szerkesztése |
| Kódok listázása |
| Kódokhoz tartózó vélemények listázása |
| Szűrés helyre |
| Szűrés kódra |
| Szűrés véleményre |
| Saját kódok listázása |
| Saját vélemények listázása |
| Értékelések átlagolása |
| Kódok rendezése értékelések szerint |

### API endpoint lista
| Endpoint |
| - |
| GetToilets() |
| GetToilets(string id) |
| GetToilet(string id) |
| AddToilet(Toilet t)) |
| EditToilet(Toilet t)) |
| DeleteToilet(string id) |
| GetOpinions() |
| GetOpinions(string id) |
| GetOpinion(string id) |
| AddTOpinion(Opinion o)) |
| EditOpinion(Opinion o)) |
| DeleteOpinion(string id) |
| Register(User u) |
| Login(User u) |
| Logout(User u) |

![addo](https://user-images.githubusercontent.com/80459242/236619158-19bb0e4a-e634-4d75-93f4-d2564e48021f.png)
![addt](https://user-images.githubusercontent.com/80459242/236619160-3df008bf-191a-4848-abb7-31043a1fb566.png)
![editt](https://user-images.githubusercontent.com/80459242/236619161-b670740b-845d-40d1-9186-0e254c4e5653.png)
![listo](https://user-images.githubusercontent.com/80459242/236619162-a1fbb9c0-ba5b-4ee8-8275-9ff27646887c.png)
![listw](https://user-images.githubusercontent.com/80459242/236619164-6c0daf73-b1af-413a-9317-d4c2d75d57d5.png)

