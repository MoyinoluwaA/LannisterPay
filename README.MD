# [Lannister Pay API](https://documenter.getpostman.com/view/15779746/UVeJMRmA)

## Introduction

[Lannister Pay API](https://documenter.getpostman.com/view/15779746/UVeJMRmA) is a HTTP REST API built for Lannister Pay, a Payment processing platform.

## Overview

**What you can do with this API:**

- Set up Fees Configuration
- Compute fees for transactions

## Documentation

[Read more in the documentation.](https://documenter.getpostman.com/view/15779746/UVeJMRmA)


## Set Up Development

- Check that nodejs is installed:

```
  node --version
  >> v12.22.1 or greater
```

- Clone the lannister pay repo and cd into it:

```bash
  git clone https://github.com/MoyinoluwaA/LannisterPay
  cd LannisterPay
```

- Install dependencies:

```bash
  npm install
```

- Create a `.env` file in the root folder and add  the configuration in the `.env.sample` file to it. Make sure you replace the values with the right values:

```
  # General settings
    DATABASE_URL = <DATABASE_URL> Use a mongoDb Atlas Url

```

- Run the application with the command:

```
  npm start
```
