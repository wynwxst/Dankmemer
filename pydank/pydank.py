import discord, random
from discord.ext import commands
import os
import subprocess
import pickle
import asyncio
import json
from datetime import datetime
mainshop = [{"name":"Watch","price":100,"description":"Check the Time duh"},
			{"name":"Laptop","price":1000,"description":"`_pm` access"},
			{"name":"Worldwalker","price":100000,"description":"allows you to walk worlds"},
			{"name":"PC","price":10000,"description":"Gaming"},
			{"name":"Blobo","price":99999,"description":"This thing? Idk wth it is"}]
#block users from eco mod
blockedusers = []

def blockuser(id):
	bl.append(id)
	os.system("rm -rf data/blockedusers.dat")
	pickle.dump(blockedusers,open("data/blockedusers.dat", "wb"))
	pickle.dump(bl,open("data/blockedusers.dat", "wb")) 

try:
	bl = pickle.load(open("data/blockedusers.dat","rb"))
except FileNotFoundError:
	print("run _blockeco <id> to start blockeconomy module")

# just some bj config

def bjcheck(total,aitotal):
	bjcheck.busted = 0
	bjcheck.bustedai = 0
	if total > 21:
		bjcheck.busted = 1
		return bjcheck.busted
	if total < 21:
		bjcheck.busted = 0
		return bjcheck.busted
	if aitotal > 21:
		bjcheck.bustedai = 1
		return bjcheck.bustedai
	if aitotal < 21:
		bjcheck.bustedai = 0
		return bjcheck.bustedai
def hit(total3,aitotal3):
	hit.total_value = total3
	hit.neocardai = random.randrange(1,11)
	hit.totalai = aitotal3 + hit.neocardai
	hit.neocard = random.randrange(1,11)
	if hit.neocard == 11:
		ace = random.randint(0,1,10,11)
		hit.neocard = ace
	if hit.neocardai == 11:
		ace = random.randint(0,1,10,11)
		hit.neocard = ace
	hit.total_value = total3 + hit.neocard
	bjcheck(hit.total_value,hit.totalai)
	return hit.neocard
	return hit.total_value
	return hit.neocardai
	return hit.totalai
def stand(total2,aitotal2):
	stand.win = 0
	bjcheck(total2,aitotal2)
	if bjcheck.busted == 1:
		win = 1
		return win
	if bjcheck.busted == 0:
		if total2 > aitotal2:
			stand.win = 2
			return stand.win


class pydank(commands.Cog, name='Pydank'):
	def __init__(self, bot):
		self.bot = bot

	async def try4bj(self,ctx,total_value,aitotal,amount,card1,card2,card3=None,card4=None):
		neocard1 = 0
		neocard2 = 0
		win4while = False
		cont = True
		user = ctx.author
		users = await get_bank_data()
		embed = (discord.Embed(title="Cerebrus Casino",color = discord.Color.green())
			.add_field(name = f"**Your Cards:**",value = f"{card1} | {card2}",inline = False)
			)
		await ctx.send(embed=embed)
		await ctx.send("`h`it or `s`tand?")
		#strap 1 
		try:
			while win4while == False:
				choice = await self.bot.wait_for("message", check = lambda msg: msg.author == ctx.author, timeout = 30)
				print(choice.content)
				if choice.content.lower() == "hit" or choice.content.lower() == 'h':
					hit(total_value,aitotal)
					bjcheck(total_value,aitotal)
					neocard1 = hit.neocard
					total_value = hit.total_value
					if bjcheck.busted == 1:
						embed = (discord.Embed(title="Cerebrus Casino",color = discord.Color.red())
						.add_field(name = f"**Your Cards:**",value = f"{card1} | {card2} | {hit.neocard}\n**You Busted** You lost {str(amount)}",inline = False)
						)
						cont = False
						return False
					#if neocard1 == 0:
						#await self.try4bj(ctx,hit.total_value,aitotal,amount,card1,card2)
						#return
					#if neocard2 == 0:
						#await self.try4bj(ctx,hit.total_value,aitotal,amount,card1,card2,neocard1)
						#return
					hit(total_value,aitotal)
					neocard2 = hit.neocard
					await self.try4bj(ctx,hit.total_value,aitotal,amount,card1,card2,neocard1,neocard2)

					return 
				if choice.content.lower() == "stand" or choice.content.lower() == 's':
					cont = False
					if total_value == 21:
						win4while = True
					bjcheck(total_value,aitotal)
					if bjcheck.busted == 1:
						embed = (discord.Embed(title="Cerebrus Casino",color = discord.Color.green())
						.add_field(name = f"**Your Cards:**",value = f"{card1} | {card2} | {hit.neocard}\n**You Busted** You lost {str(amount)}",inline = False)
						)
						users[str(user.id)]["wallet"] -= amount
						await ctx.send(embed=embed)
						cont = False
					if bjcheck.busted == 0:
						if total_value > aitotal:
							win4while=True
						if aitotal > total_value:
							embed = (discord.Embed(title="Cerebrus Casino",color = discord.Color.red())
							.add_field(name = f"**Your Cards:**",value = f"{card1} | {card2} | {hit.neocard}\n**The bot beat you** You lost {str(amount)}",inline = False)
							)
							users[str(user.id)]["wallet"] -= amount
							await ctx.send(embed=embed)
							cont = False
				if choice.content.lower() != "stand" and choice.content.lower() != 's' and choice.content.lower() != "hit" and choice.content.lower() != "h":
					await ctx.send("say it properly smh")
					return False
			if win4while == True:
				users[str(user.id)]["wallet"] += amount
				if total_value == 21:
					embed = (discord.Embed(title="Cerebrus Casino",color = discord.Color.green())
					.add_field(name = f"**Your Cards:**",value = f"{card1} | {card2} | total : {total_value}\n**You Got 21** You won {str(amount)}",inline = False)
					)
					await ctx.send(embed=embed)
					cont = False
				else:
					embed = (discord.Embed(title="Cerebrus Casino",color = discord.Color.green())
					.add_field(name = f"**Your Cards:**",value = f"{card1} | {card2} | total :  {total_value}\n**You beat the bot** You won {str(amount)}",inline = False)
					)
					cont = False
		except asyncio.TimeoutError:
			await ctx.send(
					f"<@{ctx.author.id}> Cerebrus got tired of waiting and took your money anyway")
			users[str(user.id)]["wallet"] -= amount
			cont = False
	@commands.command()
	async def kill(self,ctx,user:discord.Member):
		kill_messages = [
			f'{ctx.author.name} killed {user.name} with a baseball bat', 
			f'{ctx.author.name} killed {user.name} with a frying pan', f'{ctx.author.name} killed {user.name} by showing their ugly face', f'{ctx.author.name} wreckt {user.name} by being a builder', f'{ctx.author.name} murdered {user.name} in cold blood', f'{ctx.author.name} showed {user.name} a tiktok', f'{ctx.author.name} got killed by {user.name} by nosebleed got a bit excited eh'
    ]  # This is where you will have your kill messages. Make sure to add the mentioning of the author (ctx.message.author.mention) and the member mentioning (member.mention) to it
		await ctx.send(random.choice(kill_messages))
	@commands.command()
	async def scout(self,ctx):
		scout_locations = ["hell","sea","minecraft","discord","wtfisthis","DMs","dank memer","github","google bank","temple","desert","area51","bitcoin","wallet","bank","litecoin","kaneki's room","eris's bag"]
		l1 = random.choice(scout_locations)
		l2 = random.choice(scout_locations)
		l3 = random.choice(scout_locations)
		await ctx.send(f"Scout locations:\n`{l1}` | `{l2}` | `{l3}`")
		choice = await self.bot.wait_for("message", check = lambda msg: msg.author == ctx.author, timeout = 30)
		print(choice.content)
		user = ctx.author
		if choice.content.lower() == l1:
			users = await get_bank_data()

			earnings = random.randrange(101)

			await ctx.send(f'{ctx.author.mention} scouted {l1} for {earnings}')

			users[str(user.id)]["wallet"] += earnings

			with open("data/mainbank.json",'w') as f:
				json.dump(users,f)

		if choice.content.lower() == l2:
			users = await get_bank_data()

			earnings = random.randrange(101)

			await ctx.send(f'{ctx.author.mention} risked their lives to steal {earnings} from {l2}')

			users[str(user.id)]["wallet"] += earnings

			with open("data/mainbank.json",'w') as f:
				json.dump(users,f)
		
		if choice.content.lower() == l3:
			users = await get_bank_data()

			earnings = random.randrange(101)

			await ctx.send(f'{ctx.author.mention} got {earnings} in a godly way by decmiating {l3}')

			users[str(user.id)]["wallet"] += earnings

			with open("data/mainbank.json",'w') as f:
				json.dump(users,f)
	@commands.command(aliases=["pm"])
	async def postmemes(self,ctx):
		amount = 1
		item = "Laptop"
		res = await check(ctx.author,item,amount)

		if not res[0]:
			if res[1]==1:
				await ctx.send("That Object isn't there!")
				return
			if res[1]==2:
				await ctx.send(f"You don't have a laptop in your bag.")
				return
			if res[1]==3:
				await ctx.send(f"You don't have a laptop in your bag.")
				return
		await ctx.send("WIP")
	@commands.command(aliases=["hl"])
	async def highlow(self,ctx):
		number = random.randrange(1,101)
		hint = random.randrange(1,101)
		embed = (discord.Embed(title = "highlow",description = f"your hint is **{str(hint)}**\npick wether is is `high`, `low` or `same` than a random number",color=discord.Color.green()))
		await ctx.send(embed=embed)
		choice = await self.bot.wait_for("message", check = lambda msg: msg.author == ctx.author, timeout = 30)
		print(choice.content)
		user = ctx.author
		if choice.content.lower() == "high":
			if number < hint:
				users = await get_bank_data()

				earnings = random.randrange(101)

				await ctx.send(f"You guessed right and earned {earnings}\nthe number was {str(number)}")


				users[str(user.id)]["wallet"] += earnings

				with open("data/mainbank.json",'w') as f:
					json.dump(users,f)
				return
			else:
				await ctx.send(f"You lost the number was {str(number)}")
		if choice.content.lower() == "low":
			if number > hint:
				users = await get_bank_data()

				earnings = random.randrange(101)

				await ctx.send(f"You guessed right and earned {earnings}\nthe number was {str(number)}")


				users[str(user.id)]["wallet"] += earnings

				with open("data/mainbank.json",'w') as f:
					json.dump(users,f)
				return
			else:
				await ctx.send(f"You lost the number was {str(number)}")
		if choice.content.lower() == "same":
			if hint == number:
				users = await get_bank_data()

				earnings = random.randrange(101)

				await ctx.send(f"You guessed right and earned {earnings}\nthe number was {str(number)}")


				users[str(user.id)]["wallet"] += earnings

				with open("data/mainbank.json",'w') as f:
					json.dump(users,f)
				return
			else:
				await ctx.send(f"You lost the number was {str(number)}")
	@commands.command(aliases=["se"])
	async def snakeeyes(self,ctx,bet):
		bet = int(bet)
		dice1 = random.randrange(0,7)
		dice2 = random.randrange(0,7)
		if dice2 == 1 or dice1 == 1:
			user = ctx.author
			users = await get_bank_data()

			earnings = 1.8*bet

			embed = (discord.Embed(title = "Cerebrus Snakeyes",description = f"{dice1} | {dice2}\nyou won {earnings}",color = discord.Color.green()))
			await ctx.send(embed=embed)

			users[str(user.id)]["wallet"] += earnings

			with open("data/mainbank.json",'w') as f:
				json.dump(users,f)
		if dice1 == 1 and dice2 == 1:
			user = ctx.author
			users = await get_bank_data()

			earnings = 3*bet
			embed = (discord.Embed(title = "Cerebrus Snakeyes",description = f"{dice1} | {dice2}\nyou won {earnings}",color = discord.Color.green()))
			await ctx.send(embed=embed)

			users[str(user.id)]["wallet"] += earnings

			with open("data/mainbank.json",'w') as f:
				json.dump(users,f)
		if dice1 != 1 and dice2 != 1:
			user = ctx.author
			users = await get_bank_data()

			earnings = bet

			embed = (discord.Embed(title = "Cerebrus Snakeyes",description = f"{dice1} | {dice2}\nyou lost {earnings}",color = discord.Color.red()))
			await ctx.send(embed=embed)

			users[str(user.id)]["wallet"] += -1*earnings

			with open("data/mainbank.json",'w') as f:
				json.dump(users,f)
		if dice1 == 1 and dice2 == 1:
			user = ctx.author
			users = await get_bank_data()

			earnings = bet
			embed = (discord.Embed(title = "Cerebrus Snakeyes",description = f"{dice1} | {dice2}\nyou won {earnings}",color=discord.Color.green()))
			await ctx.send(embed=embed)

			users[str(user.id)]["wallet"] += -1*earnings

			with open("data/mainbank.json",'w') as f:
				json.dump(users,f)

	@commands.command(name="blockeco")
	async def blockeco(self,ctx,id):
		try:
			f = open("data/blockedusers.dat")
			f.close()
    # Do something with the file
		except FileNotFoundError:
			blockd = await ctx.send("Creating blocked data")
			pickle.dump(blockedusers,open("data/blockedusers.dat", "wb"))
			pickle.dump(bl,open("data/blockedusers.dat", "wb"))
			await asyncio.sleep(1)
			await blockd.edit("Created blocked data")
		id = int(id)
		if id != int:
			await ctx.send("Ids only, no mentions")
		blockuser(id)
		await ctx.send(f"succesfully blocked <@{id}> from economy")

	@commands.command(aliases=['bal'])
	async def balance(self, ctx,member:discord.Member=None):
		for item in bl:
			if item == ctx.author.id:
				await ctx.send("You are blocked")
				return
		if member != None:
			user = member
			users = await get_bank_data()
			wallet_amt = users[str(user.id)]["wallet"]
			bank_amt = users[str(user.id)]["bank"]
			fnet = wallet_amt+bank_amt
			wallet_amt = "{:,}".format(wallet_amt)
			bank_amt = "{:,}".format(bank_amt)
			fnet = "{:,}".format(fnet)
			em = discord.Embed(title=f"{member.name}'s Balance", description = f'**Wallet:** {wallet_amt}\n**Bank:** {bank_amt}\n**Net Worth:** {fnet}', color = discord.Color.magenta())
			em.set_footer(text = 'Eh')
			await ctx.send(embed= em)
			return
		await open_account(ctx.author)
		user = ctx.author
		users = await get_bank_data()
		wallet_amt = users[str(user.id)]["wallet"]
		bank_amt = users[str(user.id)]["bank"]
		fnet = wallet_amt+bank_amt
		wallet_amt = "{:,}".format(wallet_amt)
		bank_amt = "{:,}".format(bank_amt)
		fnet = "{:,}".format(fnet)
		em = discord.Embed(title=f"{ctx.author.name}'s Balance", description = f'**Wallet:** {wallet_amt}\n**Bank:** {bank_amt}\n**Net Worth:** {fnet}', color = discord.Color.magenta())
		em.set_footer(text = 'Eh')
		await ctx.send(embed= em)
		return


	@commands.command()
	@commands.cooldown(1, 1440, commands.BucketType.user)
	async def daily(self, ctx):
		user = ctx.author
		users = await get_bank_data()

		earnings = 1000

		await ctx.send(f'{ctx.author.mention} Got {earnings} coins!!')

		users[str(user.id)]["wallet"] += earnings

		with open("data/mainbank.json",'w') as f:
			json.dump(users,f)
	@commands.command()
	@commands.cooldown(1, 10080, commands.BucketType.user)
	async def weekly(self, ctx):
		user = ctx.author
		users = await get_bank_data()

		earnings = 10000

		await ctx.send(f'{ctx.author.mention} Got {earnings} coins!!')

		users[str(user.id)]["wallet"] += earnings

		with open("data/mainbank.json",'w') as f:
			json.dump(users,f)
	@commands.command()
	@commands.cooldown(1, 43800, commands.BucketType.user)
	async def monthly(self, ctx):
		user = ctx.author
		users = await get_bank_data()

		earnings = 30000

		await ctx.send(f'{ctx.author.mention} Got {earnings} coins!!')

		users[str(user.id)]["wallet"] += earnings

		with open("data/mainbank.json",'w') as f:
			json.dump(users,f)
	
	@commands.command(name = 'blackjack', aliases = ['bj'])
	async def blackjack(self,ctx,amount):
		bal = await update_bank(ctx.author)
		amount = int(amount)
		if amount > bal[0]:
			await ctx.send('You do not have sufficient balance')
			return
		if amount < 0:
			await ctx.send('Amount must be positive!')
			return
		if amount < 100:
			await ctx.send("Bet must be at least **100**")
			return
		total_value = 0
		neocard1 = 0
		neocard2 = 0
		user = ctx.author
		users = await get_bank_data()
		card1 = random.randrange(1,11)
		card2 = random.randrange(1,11)
		ai1 = random.randrange(1,11)
		ai2 = random.randrange(1,11)
		if card1 == 11:
			ace = random.randint(0,1,10,11)
			card1 = ace
		if card2 == 11:
			ace = random.randint(0,1,10,11)
			card1 = ace
		total_value = card1 + card2
		aitotal = ai1 + ai2
		await self.try4bj(ctx,total_value,aitotal,amount,card1,card2)
		'''
		if try4bj.cont == True:
			await self.try4bj(ctx,hit.total_value,amount,card1,card2,hit.neocard)
			if self.try4bj.cont == True:
				await self.try4bj(ctx,hit.total_value,amount,card1,card2,hit.neocard,self.try4bj.neocard1)
				if self.try4bj.cont == True:
					embed = (discord.Embed(title="Cerebrus Casino",description = f"{card1} | {card2} | {hit.neocard} |{self.try4bj.neocard1} | {self.try4bj.neocard2}"))
					await ctx.send(embed=embed)

		if self.try4bj.cont == False:
			await ctx.send("game ended")
		'''

	
	@commands.command()
	@commands.cooldown(1, 10, commands.BucketType.user)
	async def beg(self, ctx):
		await open_account(ctx.author)
		user = ctx.author
		if ctx.author.id == 746904488396324864:
			users = await get_bank_data()

			earnings = 999

			await ctx.send(f'{ctx.author.mention} Got {earnings} coins!!')

			users[str(user.id)]["wallet"] += earnings

			with open("data/mainbank.json",'w') as f:
				json.dump(users,f)

		else:


			users = await get_bank_data()

			earnings = random.randrange(101)

			await ctx.send(f'{ctx.author.mention} Got {earnings} coins!!')

			users[str(user.id)]["wallet"] += earnings

			with open("data/mainbank.json",'w') as f:
				json.dump(users,f)


	@commands.command(aliases=['with'])
	@commands.cooldown(1, 2, commands.BucketType.user)
	async def withdraw(self, ctx,amount = None):
		await open_account(ctx.author)
		if amount == None:
			await ctx.send("Please enter the amount")
			return

		bal = await update_bank(ctx.author)

		amount = int(amount)

		if amount > bal[1]:
			await ctx.send('You do not have sufficient balance')
			return
		if amount < 0:
			await ctx.send('Amount must be positive!')
			return

		await update_bank(ctx.author,amount)
		await update_bank(ctx.author,-1*amount,'bank')
		await ctx.send(f'{ctx.author.mention} You withdrew {amount} coins')


	@commands.command(aliases=['dep'])
	@commands.cooldown(1, 2, commands.BucketType.user)
	async def deposit(self, ctx,amount = None):
		await open_account(ctx.author)
		if amount == None:
			await ctx.send("Please enter the amount")
			return

		bal = await update_bank(ctx.author)

		amount = int(amount)

		if amount > bal[0]:
			await ctx.send('You do not have sufficient balance')
			return
		if amount < 0:
			await ctx.send('Amount must be positive!')
			return

		await update_bank(ctx.author,-1*amount)
		await update_bank(ctx.author,amount,'bank')
		await ctx.send(f'{ctx.author.mention} You deposited {amount} coins')

	@commands.command(aliases=["cf"])
	@commands.cooldown(1, 10, commands.BucketType.user)
	async def coinflip(self,ctx,amount=None,htc=None):
		flip = "none"
		bal = await update_bank(ctx.author)
		intamount = 0.5*int(amount)
		origamount = int(amount)
		if origamount > bal[0]:
			await ctx.send('You do not have sufficient balance')
			return
		if origamount < 0:
			await ctx.send('Amount must be positive!')
			return
		if origamount < 100:
			await ctx.send("Bet must be at least **100**")
			return
		if amount == None:
			await ctx.send("please enter an amount")
		intamount = 0.5*(intamount)
		if htc == None:
			await ctx.send("please enter heads or tails")
		ht =  random.randrange(1,3)
		if ht == 0:
			flip = "heads"
		if ht == 1:
			flip = "tails"
		if htc == flip:
			embed = (discord.Embed(title = "Cerebrus Casino",description="You won **" + amount + f"**\n your coin was {flip} :coin:",color=discord.Color.green()))
			await ctx.send(embed=embed)
			await update_bank(ctx.author,1*origamount)
		if htc != flip:
			amount = str(amount)
			embed = (discord.Embed(title = "Cerebrus Casino",description="You lost **" + amount + f"**\n the coin was {flip} :coin:",color=discord.Color.red()))
			await ctx.send(embed=embed)
			amount = int(amount)
			await update_bank(ctx.author,-1*origamount)


	@commands.command()
	@commands.cooldown(1, 20, commands.BucketType.user)
	async def send(self, ctx,member : discord.Member,amount = None):
		await open_account(ctx.author)
		await open_account(member)
		if amount == None:
			await ctx.send("Please enter the amount")
			return

		bal = await update_bank(ctx.author)
		if amount == 'all':
			amount = bal[0]

		amount = int(amount)

		if amount > bal[0]:
			await ctx.send('You do not have sufficient balance')
			return
		if amount < 0:
			await ctx.send('Amount must be positive!')
			return

		await update_bank(ctx.author,-1*amount,'wallet')
		await update_bank(member,amount,'wallet')
		await ctx.send(f'{ctx.author.mention} You gave {member} {amount} coins')
		await member.send(f"{ctx.author.name} gave you {amount}")
	@commands.command()
	async def reset(self,ctx):
		await ctx.send("reset")
	@commands.command()
	async def gift(self,ctx,member:discord.Member=None,item=None,amount=None):
		if member == None:
			await ctx.send("`_gift @member item amount` eg. `_gift @kaneki#9586 watch 1`")
		if item == None:
			await ctx.send("`_gift @member item amount` eg. `_gift @kaneki#9586 watch 1`")
		if amount == None:
			await ctx.send("`_gift @member item amount` eg. `_gift @kaneki#9586 watch 1`")
		res = await check(ctx.author,item,1)

		if not res[0]:
			if res[1]==1:
				await ctx.send("That Object isn't there!")
				return
			if res[1]==2:
				await ctx.send(f"You don't have {item} in your bag.")
				return
			if res[1]==3:
				await ctx.send(f"You don't have {item} in your bag.")
				return

		sell_this(ctx.author,item,amount)
		buy_this(member,item,amount)

			

	@commands.command(aliases=['rb'])
	@commands.cooldown(1, 40, commands.BucketType.user)
	async def rob(self, ctx,member : discord.Member):
		await open_account(ctx.author)
		await open_account(member)
		bal = await update_bank(member)


		if bal[0]<100:
			await ctx.send('It is useless to rob him :(')
			return

		earning = random.randrange(0,bal[0])

		await update_bank(ctx.author,earning)
		await update_bank(member,-1*earning)
		await ctx.send(f'{ctx.author.mention} You robbed {member} and got {earning} coins')


	@commands.command()
	@commands.cooldown(1, 5, commands.BucketType.user)
	async def slots(self, ctx,amount = None):
		await open_account(ctx.author)
		if amount == None:
			await ctx.send("Please enter the amount")
			return

		bal = await update_bank(ctx.author)

		amount = int(amount)

		if amount > bal[0]:
			await ctx.send('You do not have sufficient balance')
			return
		if amount < 0:
			await ctx.send('Amount must be positive!')
			return
		if amount < 100:
			await ctx.send("Slots must be at least **100**")
			return
		final = []
		for i in range(3):
			a = random.choice(['❎','🅾','👑','🅰','🔑','🥈'])
			final.append(a)

		final = " | ".join(final)
		embed = (discord.Embed(title = "Cerebrus Casino",description = "Slots:\n" + str(final),color = discord.Color.green()))
		await ctx.send(embed=embed)

		if final[0] == final[1] or final[1] == final[2] or final[0] == final[2]:
			await update_bank(ctx.author,2*amount)
			users = await get_bank_data()
			wallet_amt = users[str(ctx.author.id)]["wallet"]
			embed = (discord.Embed(title = "Cerebrus Casino",description = "You won **" + str(amount) + "** Your current balance is **" + str(wallet_amt) + "**", color= discord.Color.green()))
			await ctx.send(embed=embed)
		else:
			await update_bank(ctx.author,-1*amount)
			users = await get_bank_data()
			wallet_amt = users[str(ctx.author.id)]["wallet"]
			embed = (discord.Embed(title = "Cerebrus Casino",description = "You lost " + str(amount) + " Your current balance is " + str(wallet_amt), color= discord.Color.green()))
			await ctx.send(embed=embed)

	@commands.command()
	@commands.cooldown(1, 5, commands.BucketType.user)
	async def bet(self, ctx, amount = None):
		if amount == None:
			await ctx.send("Please enter the amount")
		bal = await update_bank(ctx.author)

		amount = int(amount)

		if amount > bal[0]:
			await ctx.send('You do not have sufficient balance')
			return
		if amount < 0:
			await ctx.send('Amount must be positive!')
			return
		if amount < 100:
			await ctx.send("Bet must be at least **100**")
			return
		betrig = random.randrange(1,13)
		if betrig < 6:
			await update_bank(ctx.author,-1*amount)
			users = await get_bank_data()
			wallet_amt = users[str(ctx.author.id)]["wallet"]
			boldwallet_amt = "**" + str(wallet_amt) + "**"
			embed = (discord.Embed(title = "Cerebrus Casino", description = "You rolled **" + str(betrig) + "**\nYou lost **" + str(amount) + "** Your current balance is " + boldwallet_amt, color = discord.Color.red() ))
			await ctx.send(embed=embed)
		if betrig > 6 and betrig < 8:
			await update_bank(ctx.author,0.5*amount)
			users = await get_bank_data()
			wallet_amt = users[str(ctx.author.id)]["wallet"]
			boldwallet_amt = "**" + str(wallet_amt) + "**"
			wonhalf = 0.5*amount
			embed = (discord.Embed(title = "Cerebrus Casino", description = "You rolled " + str(betrig) + "**\nYou won **" + str(wonhalf) + "** Your current balance is " + boldwallet_amt, color = discord.Color.green() ))
			await ctx.send(embed=embed)
		if betrig > 8 and betrig < 11:
			await update_bank(ctx.author,2*amount)
			users = await get_bank_data()
			wallet_amt = users[str(ctx.author.id)]["wallet"]
			boldwallet_amt = "**" + str(wallet_amt) + "**"
			embed = (discord.Embed(title = "Cerebrus Casino", description = "You rolled " + str(betrig) + "**\nYou won **" + str(amount) + "** Your current balance is " + boldwallet_amt, color = discord.Color.green() ))
			await ctx.send(embed=embed)
		if betrig == 12:
			await update_bank(ctx.author, 3*amount)
			users = await get_bank_data()
			wallet_amt = users[str(ctx.author.id)]["wallet"]
			wonbet12 = amount*3
			boldwallet_amt = "**" + str(wallet_amt) + "**"
			embed = (discord.Embed(title = "Cerebrus Casino", description = "You rolled " + str(betrig) + "**\nYou won **" + str(wonbet12) + "** Your current balance is " + boldwallet_amt, color = discord.Color.green() ))
			await ctx.send(embed=embed)
		
	@commands.command()
	async def shop(self, ctx,*,args=None):
		if args != None:
			if args == "watch" or args == "Watch":
				embed = (discord.Embed(title="A watch",description = "A somewhat useful device fo telling the time lol", color = discord.Color.green()))
				await ctx.send(embed=embed)
			#await ctx.send("WIP")
			return
		em = discord.Embed(title = "Shop",color = discord.Color.green())

		for item in mainshop:
			name = item["name"]
			price = item["price"]
			desc = item["description"]
			em.add_field(name = name, value = f"${price} | {desc}", inline = False)

		await ctx.send(embed = em)



	@commands.command()
	async def buy(self, ctx,item,amount = 1):
		await open_account(ctx.author)

		res = await buy_this(ctx.author,item,amount)

		if not res[0]:
			if res[1]==1:
				await ctx.send("That Object isn't there!")
				return
			if res[1]==2:
				await ctx.send(f"You don't have enough money in your wallet to buy {amount} {item}")
				return


		await ctx.send(f"You just bought {amount} {item}")


	@commands.command(aliases=["inv"])
	async def bag(self, ctx,member:discord.Member=None):
		await open_account(ctx.author)
		user = ctx.author
		users = await get_bank_data()

		try:
			bag = users[str(user.id)]["bag"]
		except:
			bag = []


		em = discord.Embed(title = "Bag")
		for item in bag:
			name = item["item"]
			amount = item["amount"]
			em.add_field(name = name, value = amount, inline = False)
		await ctx.send(embed = em)

	@commands.command()
	async def sell(self, ctx,item):
		await open_account(ctx.author)
		amount = 1
		bolditem = "**" + item + "**"
		res = await sell_this(ctx.author,item,amount)

		if not res[0]:
			if res[1]==1:
				await ctx.send("That Object isn't there!")
				return
			if res[1]==2:
				await ctx.send(f"You don't have {amount} {item} in your bag.")
				return
			if res[1]==3:
				await ctx.send(f"You don't have {item} in your bag.")
				return
		if item == "watch":
			amount = 500
			boldamount = "**" + str(amount) + "**"
			await update_bank(ctx.author,1*amount)
			users = await get_bank_data()
			wallet_amt = users[str(ctx.author.id)]["wallet"]
			boldwallet_amt = "**" + str(wallet_amt) + "**"
			embed = (discord.Embed(title = "Sold",description = "You sold " + bolditem + " for " + boldamount + "\n Your current balance is " + boldwallet_amt))
		await ctx.send(embed = embed)


	@commands.command(aliases = ["lb"])
	async def leaderboard(self, ctx,x = 1):
		users = await get_bank_data()
		leader_board = {}
		total = []
		for user in users:
			name = int(user)
			total_amount = users[user]["wallet"] + users[user]["bank"]
			leader_board[total_amount] = name
			total.append(total_amount)

		total = sorted(total,reverse=True)    

		em = discord.Embed(title = f"Top {x} Richest People" , description = "This is decided on the basis of raw money in the bank and wallet",color = discord.Color(0xfa43ee))
		index = 1
		for amt in total:
			id_ = leader_board[amt]
			member = self.bot.get_user(id_)
			name = member.name
			em.add_field(name = f"{index}. {name}" , value = f"{amt}",  inline = False)
			if index == x:
				break
			else:
				index += 1

		await ctx.send(embed = em)
	@commands.command()
	async def use(self,ctx,*,item,action=None):
		amount = 1
		if item == "xyz":
			res = await sell_this(ctx.author,item,amount)
			return
		if item == "ww" or "world walker":
			item = "worldwalker"
		res = await check(ctx.author,item,amount)
		if not res[0]:
			if res[1]==1:
				await ctx.send("That Object isn't there!")
				return
			if res[1]==2:
				await ctx.send(f"You don't have {item} in your bag.")
				return
			if res[1]==3:
				await ctx.send(f"You don't have {item} in your bag.")
				return
		if item == "watch":
			now = datetime.now()

			current_time = now.strftime("%H:%M:%S")
			embed = (discord.Embed(title = "Time ~ CS",description = "The time is " +  current_time ))
			await ctx.send(embed=embed)
		if item == "world walker" or item == "worldwalker" or item == "ww":
			id = ctx.author.id
			with open('data/users.json', 'r') as f:
					users = json.load(f)
			lvl = users[str(id)]['level']
			if lvl < 10:
				if action == None:
					embed = discord.Embed(title="World walking",description = "Worlds avaliable:\n`Normal` | `Hell`",color=discord.Color.green()
					.add_footer("Level up for more worlds")
					)
					await ctx.send(embed=embed)
					return
				if action == "hell":
					await ctx.send("world switched to hell")
			if lvl < 20:
				if action == None:
					embed = discord.Embed(title="World walking",description = "Worlds avaliable:\n`Normal` | `Hell` | `Temple`",color=discord.Color.green()
					.add_footer("Level up for more worlds")
					)
					await ctx.send(embed=embed)
					return
				if action == "hell":
					await ctx.send("world switched to hell")
				if action == "temple":
					await ctx.send("world switched to temple")


async def sell_this(user,item_name,amount,price = None):
	item_name = item_name.lower()
	name_ = None
	for item in mainshop:
		name = item["name"].lower()
		if name == item_name:
			name_ = name
			if price==None:
				price = 0.7* item["price"]
			break

	if name_ == None:
		return [False,1]

	cost = price*amount

	users = await get_bank_data()

	bal = await update_bank(user)


	try:
		index = 0
		t = None
		for thing in users[str(user.id)]["bag"]:
			n = thing["item"]
			if n == item_name:
				old_amt = thing["amount"]
				new_amt = old_amt - amount
				if new_amt < 0:
					return [False,2]
				users[str(user.id)]["bag"][index]["amount"] = new_amt
				t = 1
				break
			index+=1 
		if t == None:
			return [False,3]
	except:
		return [False,3]    

	with open("data/mainbank.json","w") as f:
		json.dump(users,f)

	await update_bank(user,cost,"wallet")

	return [True,"Worked"]

async def check(user,item_name,amount = None ,price = None):
	item_name = item_name.lower()
	name_ = None
	for item in mainshop:
		name = item["name"].lower()
		if name == item_name:
			name_ = name
			if price==None:
				price = 0.7* item["price"]
			break

	if name_ == None:
		return [False,1]

	cost = price*amount

	users = await get_bank_data()

	bal = await update_bank(user)


	try:
		index = 0
		t = None
		for thing in users[str(user.id)]["bag"]:
			n = thing["item"]
			if n == item_name:
				old_amt = thing["amount"]
				new_amt = old_amt - amount
				if new_amt < 0:
					return [False,2]
				users[str(user.id)]["bag"][index]["amount"] = new_amt
				t = 1
				break
			#index+=1 
		if t == None:
			return [False,3]
	except:
		return [False,3]    

	#with open("data/mainbank.json","w") as f:
		#json.dump(users,f)

	#await update_bank(user,cost,"wallet")

	return [True,"Worked"]


async def open_account(user):

	users = await get_bank_data()

	if str(user.id) in users:
		return False
	else:
		users[str(user.id)] = {}
		users[str(user.id)]["wallet"] = 0
		users[str(user.id)]["bank"] = 0

	with open('data/mainbank.json','w') as f:
		json.dump(users,f)

	return True


async def get_bank_data():
	with open('data/mainbank.json','r') as f:
		users = json.load(f)

	return users


async def update_bank(user,change=0,mode = 'wallet'):
	users = await get_bank_data()

	users[str(user.id)][mode] += change

	with open('data/mainbank.json','w') as f:
		json.dump(users,f)
	bal = users[str(user.id)]['wallet'],users[str(user.id)]['bank']
	return bal

async def buy_this(user,item_name,amount):
	item_name = item_name.lower()
	name_ = None
	for item in mainshop:
		name = item["name"].lower()
		if name == item_name:
			name_ = name
			price = item["price"]
			break

	if name_ == None:
		return [False,1]

	cost = price*amount

	users = await get_bank_data()

	bal = await update_bank(user)

	if bal[0]<cost:
		return [False,2]


	try:
		index = 0
		t = None
		for thing in users[str(user.id)]["bag"]:
			n = thing["item"]
			if n == item_name:
				old_amt = thing["amount"]
				new_amt = old_amt + amount
				users[str(user.id)]["bag"][index]["amount"] = new_amt
				t = 1
				break
			index+=1 
		if t == None:
			obj = {"item":item_name , "amount" : amount}
			users[str(user.id)]["bag"].append(obj)
	except:
		obj = {"item":item_name , "amount" : amount}
		users[str(user.id)]["bag"] = [obj]        

	with open("data/mainbank.json","w") as f:
		json.dump(users,f)

	await update_bank(user,cost*-1,"wallet")

	return [True,"Worked"]
		


def setup(bot):
    bot.add_cog(pydank(bot))  
