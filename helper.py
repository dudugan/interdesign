def spacestring(input, space):
    output = ""
    for char in input:
        output += char
        output += space
    return output

def overlapstring(input1, input2):
    output = ""
    maxlen = max(len(input1), len(input2))
    for i in range(0, maxlen):
        if input1[i]:
            output += input1[i]
        if input2[i]:
            output += input2[i]
    return output

fxn = input('''which helper
            function would you like to perform? ''')
if fxn == 'space':
    inp = input('input: ')
    sp = input('space chararacter: ')
    print(spacestring(inp, sp))
elif fxn == 'overlap':
    inp1 = input('first string: ')
    inp2 = input('second string: ')
    print(overlapstring(inp1, inp2))