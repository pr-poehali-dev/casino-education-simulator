import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface GameResult {
  id: string;
  game: string;
  result: string;
  probability: number;
  timestamp: Date;
  payout: number;
}

interface Statistics {
  totalGames: number;
  winRate: number;
  averagePayout: number;
  mostPlayed: string;
}

const Index = () => {
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [stats, setStats] = useState<Statistics>({
    totalGames: 0,
    winRate: 0,
    averagePayout: 0,
    mostPlayed: 'Рулетка'
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentResult, setCurrentResult] = useState<string>('');

  // Симулятор рулетки
  const spinRoulette = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setCurrentResult('Крутится...');
    
    setTimeout(() => {
      const numbers = Array.from({ length: 37 }, (_, i) => i);
      const result = numbers[Math.floor(Math.random() * numbers.length)];
      const color = result === 0 ? 'green' : (result % 2 === 0 ? 'black' : 'red');
      const resultText = `${result} (${color === 'green' ? 'зелёный' : color === 'red' ? 'красный' : 'чёрный'})`;
      
      const probability = result === 0 ? 2.7 : (color === 'red' || color === 'black' ? 48.6 : 0);
      const payout = result === 0 ? 35 : (Math.random() > 0.5 ? 2 : 0);
      
      const newResult: GameResult = {
        id: Date.now().toString(),
        game: 'Рулетка',
        result: resultText,
        probability,
        timestamp: new Date(),
        payout
      };
      
      setGameHistory(prev => [newResult, ...prev.slice(0, 9)]);
      setCurrentResult(resultText);
      setIsSpinning(false);
      
      // Обновляем статистику
      updateStats([newResult, ...gameHistory]);
    }, 2000);
  };

  // Симулятор костей
  const rollDice = () => {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const sum = dice1 + dice2;
    
    const probabilities: { [key: number]: number } = {
      2: 2.78, 3: 5.56, 4: 8.33, 5: 11.11, 6: 13.89, 7: 16.67,
      8: 13.89, 9: 11.11, 10: 8.33, 11: 5.56, 12: 2.78
    };
    
    const newResult: GameResult = {
      id: Date.now().toString(),
      game: 'Кости',
      result: `${dice1} + ${dice2} = ${sum}`,
      probability: probabilities[sum],
      timestamp: new Date(),
      payout: sum === 7 ? 4 : (sum === 2 || sum === 12 ? 30 : 0)
    };
    
    setGameHistory(prev => [newResult, ...prev.slice(0, 9)]);
    updateStats([newResult, ...gameHistory]);
  };

  // Симулятор карт
  const drawCard = () => {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    
    const isRed = suit === '♥' || suit === '♦';
    const probability = isRed ? 50 : 50;
    
    const newResult: GameResult = {
      id: Date.now().toString(),
      game: 'Карты',
      result: `${value}${suit}`,
      probability,
      timestamp: new Date(),
      payout: ['J', 'Q', 'K', 'A'].includes(value) ? 3 : 1
    };
    
    setGameHistory(prev => [newResult, ...prev.slice(0, 9)]);
    updateStats([newResult, ...gameHistory]);
  };

  const updateStats = (history: GameResult[]) => {
    if (history.length === 0) return;
    
    const totalGames = history.length;
    const wins = history.filter(game => game.payout > 0).length;
    const winRate = (wins / totalGames) * 100;
    const averagePayout = history.reduce((sum, game) => sum + game.payout, 0) / totalGames;
    
    const gameCounts = history.reduce((counts, game) => {
      counts[game.game] = (counts[game.game] || 0) + 1;
      return counts;
    }, {} as { [key: string]: number });
    
    const mostPlayed = Object.entries(gameCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Рулетка';
    
    setStats({
      totalGames,
      winRate,
      averagePayout,
      mostPlayed
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary/90 to-primary/20">
      {/* Header */}
      <header className="border-b border-border/20 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-casino-gold bg-clip-text text-transparent">
              🎰 Образовательное Казино
            </h1>
            <Badge variant="outline" className="text-sm">
              Симулятор вероятностей
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Изучайте теорию вероятностей
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Интерактивные симуляторы казино для понимания математических основ азартных игр
          </p>
        </div>

        {/* Game Simulators */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Рулетка */}
          <Card className="border-casino-gold/20 bg-background/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <span className="text-2xl">🎯</span>
                Рулетка
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                37 чисел, вероятность выпадения каждого = 2.7%
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-4 transition-all duration-500 ${
                  isSpinning ? 'animate-spin animate-pulse-glow' : 'hover:scale-110'
                }`}>
                  🎰
                </div>
                <div className="text-lg font-semibold mb-4 min-h-[2rem] animate-scale-in">
                  {currentResult || 'Сделайте ставку!'}
                </div>
              </div>
              <Button 
                onClick={spinRoulette} 
                disabled={isSpinning}
                className="w-full bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {isSpinning ? 'Крутится...' : 'Крутить рулетку'}
              </Button>
            </CardContent>
          </Card>

          {/* Кости */}
          <Card className="border-casino-gold/20 bg-background/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <span className="text-2xl">🎲</span>
                Кости
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Сумма 7 выпадает чаще всего (16.67% вероятность)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-6xl font-bold mb-4 hover:scale-110 transition-transform duration-200">
                  🎲🎲
                </div>
                <div className="text-lg font-semibold mb-4 min-h-[2rem]">
                  Бросьте кости!
                </div>
              </div>
              <Button 
                onClick={rollDice}
                className="w-full bg-casino-gold hover:bg-casino-gold/90 text-white transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Бросить кости
              </Button>
            </CardContent>
          </Card>

          {/* Карты */}
          <Card className="border-casino-gold/20 bg-background/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <span className="text-2xl">🃏</span>
                Карты
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                52 карты в колоде, вероятность каждой = 1.92%
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-6xl font-bold mb-4 hover:scale-110 transition-transform duration-200">
                  🃏
                </div>
                <div className="text-lg font-semibold mb-4 min-h-[2rem]">
                  Тяните карту!
                </div>
              </div>
              <Button 
                onClick={drawCard}
                className="w-full bg-secondary hover:bg-secondary/90 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Тянуть карту
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <Tabs defaultValue="history" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">История игр</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history">
            <Card className="bg-background/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="History" size={24} />
                  История результатов
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gameHistory.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Сыграйте в любую игру, чтобы увидеть историю результатов
                  </p>
                ) : (
                  <div className="space-y-3">
                    {gameHistory.map((game) => (
                      <div 
                        key={game.id} 
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{game.game}</Badge>
                          <span className="font-semibold">{game.result}</span>
                          <span className="text-sm text-muted-foreground">
                            {game.probability.toFixed(1)}% вероятность
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {game.payout > 0 ? (
                            <Badge className="bg-green-500">+{game.payout}x</Badge>
                          ) : (
                            <Badge variant="destructive">0x</Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {game.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-background/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="BarChart3" size={24} />
                    Общая статистика
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Всего игр:</span>
                      <span className="font-bold">{stats.totalGames}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Процент побед:</span>
                      <span className="font-bold text-green-500">{stats.winRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Средний выигрыш:</span>
                      <span className="font-bold">{stats.averagePayout.toFixed(2)}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Популярная игра:</span>
                      <span className="font-bold">{stats.mostPlayed}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Прогресс изучения</span>
                      <span>{Math.min(stats.totalGames * 10, 100)}%</span>
                    </div>
                    <Progress value={Math.min(stats.totalGames * 10, 100)} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="TrendingUp" size={24} />
                    Образовательные факты
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm">
                        <strong>Рулетка:</strong> Математическое ожидание игрока = -2.7%
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm">
                        <strong>Кости:</strong> Центральная предельная теорема в действии
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-sm">
                        <strong>Карты:</strong> Каждая карта имеет равную вероятность
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm">
                        <strong>Закон больших чисел:</strong> Чем больше игр, тем ближе к теории
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Educational Footer */}
        <Card className="bg-gradient-to-r from-primary/10 to-casino-gold/10 border-casino-gold/20">
          <CardContent className="py-8 text-center">
            <h3 className="text-2xl font-bold mb-4">🎓 Обучайтесь ответственно</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Этот симулятор создан исключительно в образовательных целях для изучения теории вероятностей 
              и математических основ случайных событий. Реальные азартные игры могут вызывать зависимость.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;