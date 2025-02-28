import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure can create new event",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('pulse-tide', 'create-event', 
        [
          types.ascii("Test Event"),
          types.ascii("A test event description"),
          types.uint(1683900000)
        ],
        deployer.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectUint(1);
  }
});

Clarinet.test({
  name: "Can submit and retrieve feedback",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const user1 = accounts.get('wallet_1')!;
    
    // Create event
    let block = chain.mineBlock([
      Tx.contractCall('pulse-tide', 'create-event',
        [
          types.ascii("Test Event"),
          types.ascii("A test event description"),
          types.uint(1683900000)
        ],
        deployer.address
      )
    ]);
    
    // Submit feedback
    block = chain.mineBlock([
      Tx.contractCall('pulse-tide', 'submit-feedback',
        [
          types.uint(1),
          types.ascii("POSITIVE"),
          types.ascii("Great event!")
        ],
        user1.address
      )
    ]);
    
    block.receipts[0].result.expectOk().expectBool(true);
    
    // Get feedback
    const feedbackResponse = chain.callReadOnlyFn(
      'pulse-tide',
      'get-user-feedback',
      [types.uint(1), types.principal(user1.address)],
      deployer.address
    );
    
    feedbackResponse.result.expectOk();
  }
});

Clarinet.test({
  name: "Cannot submit feedback for non-existent event",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const user1 = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('pulse-tide', 'submit-feedback',
        [
          types.uint(999),
          types.ascii("POSITIVE"),
          types.ascii("Great event!")
        ],
        user1.address
      )
    ]);
    
    block.receipts[0].result.expectErr().expectUint(404);
  }
});
