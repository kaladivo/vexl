import {
  eciesCTRDecrypt,
  eciesCTREncrypt,
  eciesGTMDecrypt,
  eciesGTMEncrypt,
} from './ecies'
import * as crypto from 'node:crypto'
import {generatePrivateKey, PrivateKeyPemBase64} from '../KeyHolder'
import {privateRawToPem} from '../KeyHolder/keyUtils'
import {normalizeCurveName} from '../KeyHolder/Curve.brand'

const privateKey = generatePrivateKey()

describe('ECIES GTM', () => {
  it('Should successfully encrypt and decrypt', async () => {
    const data = 'Some data'
    const encrypted = await eciesGTMEncrypt({
      data,
      publicKey: privateKey.publicKeyPemBase64,
    })
    const decrypted = await eciesGTMDecrypt({
      data: encrypted,
      privateKey: privateKey.privateKeyPemBase64,
    })
    expect(decrypted).toEqual(data)
  })

  it('Should decrypt a static message as expected', async () => {
    const privateKey2 = PrivateKeyPemBase64.parse(
      privateRawToPem(
        Buffer.from('6HizupRO2bZAhj4UHOB3uQsatrDJll8t1LSnxg==', 'base64'),
        normalizeCurveName('secp224r1')
      ).toString('base64')
    )

    const decrypted = await eciesGTMDecrypt({
      privateKey: privateKey2,
      data: '000.EO6P607oYKTZoOeADy8j5Pan5pI=.y+3Vw0lSibr9Z1Ian4UZpzM5Ugzzwotv4l1+spJDPFc=.A5PrXbHvS1hLwfmmspTz3yC2T87f2CIGfWwSVSI=.9LqmTKZm9TCLGvz7dV2Nzg==',
    })

    expect(decrypted).toEqual('Some another message')
  })

  it('Should fail when decrypting with bad key, epk, mac or security tag', async () => {
    const data = 'Some message'
    const encrypted = await eciesGTMEncrypt({
      publicKey: privateKey.publicKeyPemBase64,
      data,
    })

    const [version, epk, mac, tag, payload] = encrypted.split('.')
    const badTag = crypto.randomBytes(tag.length).toString('base64')
    const badEpk = crypto.randomBytes(epk.length).toString('base64')
    const badMac = crypto.randomBytes(mac.length).toString('base64')

    try {
      await eciesGTMDecrypt({
        privateKey: privateKey.privateKeyPemBase64,
        data: [version, badEpk, mac, tag, payload].join('.'),
      })
      expect(true).toEqual(false)
    } catch (e) {
      //
    }

    try {
      await eciesGTMDecrypt({
        privateKey: privateKey.privateKeyPemBase64,
        data: [version, epk, badMac, tag, payload].join('.'),
      })
      expect(true).toEqual(false)
    } catch (e) {
      //
    }

    try {
      await eciesGTMDecrypt({
        privateKey: privateKey.privateKeyPemBase64,
        data: [version, epk, mac, badTag, payload].join('.'),
      })
      expect(true).toEqual(false)
    } catch (e) {
      //
    }

    // Check if it does not fail when decrypting with correct data
    expect(
      await eciesGTMDecrypt({
        privateKey: privateKey.privateKeyPemBase64,
        data: [version, epk, mac, tag, payload].join('.'),
      })
    ).toEqual(data)
  })
})

describe('ECIES CTR', () => {
  it('Should successfully encrypt and decrypt', async () => {
    const data = 'Some data'
    const encrypted = await eciesCTREncrypt({
      data,
      publicKey: privateKey.publicKeyPemBase64,
    })
    const decrypted = await eciesCTRDecrypt({
      data: encrypted,
      privateKey: privateKey.privateKeyPemBase64,
    })
    expect(decrypted).toEqual(data)
  })

  it('Should decrypt a static message as expected', async () => {
    const privateKey2 = PrivateKeyPemBase64.parse(
      privateRawToPem(
        Buffer.from('6HizupRO2bZAhj4UHOB3uQsatrDJll8t1LSnxg==', 'base64'),
        normalizeCurveName('secp224r1')
      ).toString('base64')
    )

    const decrypted = await eciesCTRDecrypt({
      privateKey: privateKey2,
      data: '000.BQvz3B8hFqixnChbCFQEYfl+rxQ=.aqooJnPEuU9boeKX8lMwI5DdzNPrzwM/Fdi1Yvvkbaw=.BELHvH8luv0F69YlhN28BnLDG8RcZc4Gby+fhVA7AIMkSEmmIZd+bMmxWazXjf6DVtYEFAeih3ln',
    })

    expect(decrypted).toEqual('Some another message')
  })

  it('Should fail when decrypting with bad key, epk, mac or security tag', async () => {
    const data = 'Some message'
    const encrypted = await eciesCTREncrypt({
      publicKey: privateKey.publicKeyPemBase64,
      data,
    })

    const [version, epk, mac, payload] = encrypted.split('.')
    const badEpk = crypto.randomBytes(epk.length).toString('base64')
    const badMac = crypto.randomBytes(mac.length).toString('base64')

    try {
      await eciesCTRDecrypt({
        privateKey: privateKey.privateKeyPemBase64,
        data: [version, badEpk, mac, payload].join('.'),
      })
      // Should not be here
      expect(false).toBe(true)
    } catch (e) {
      //
    }
    try {
      await eciesCTRDecrypt({
        privateKey: privateKey.privateKeyPemBase64,
        data: [version, epk, badMac, payload].join('.'),
      })
      // Should not be here
      expect(false).toBe(true)
    } catch (e) {
      //
    }
    try {
      await eciesCTRDecrypt({
        privateKey: privateKey.privateKeyPemBase64,
        data: [version, epk, mac, payload].join('.'),
      })
      // Should not be here
      expect(false).toBe(true)
    } catch (e) {
      //
    }

    // Check if it does not fail when decrypting with correct data
    expect(
      await eciesCTRDecrypt({
        privateKey: privateKey.privateKeyPemBase64,
        data: [version, epk, mac, payload].join('.'),
      })
    ).toEqual(data)
  })
})
