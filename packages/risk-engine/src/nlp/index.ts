import nlp from 'compromise';
import type { NLPAnalysis } from '../types';

const MESSAGE_FLAGS = [
  'urgent', 'immediately', 'asap', 'now', 'action required', 'within 24 hours',
  'suspended', 'locked', 'closed', 'terminated', 'compromised', 'unauthorized',
  'bank', 'sars', 'government', 'official', 'department', 'unit', 'agency',
  'consignment', 'parcel', 'courier', 'delivery', 'unclaimed', 'package',
  'full name', 'address', 'phone number', 'email address', 'confirm your',
  'verify your account', 'update your details', 'provide your',
  'million', 'cash', 'wire transfer', 'bank account', 'inheritance', 'lottery',
  'unexpected', 'windfall', 'guaranteed', 'risk-free', 'no risk',
  'opportunity', 'investment', 'profit', 'returns',
];

export function analyzeMessageNLP(text: string): NLPAnalysis {
  const doc = nlp(text.toLowerCase());
  const features = {
    hasUrgency: doc.match('(urgent|immediately|asap|now|action required|limited time)').found,
    hasFear: doc.match('(suspended|locked|closed|terminated|compromised|unauthorized)').found,
    hasAuthority: doc.match('(bank|sars|government|official|fsca|sabic|sars)').found,
    sentenceCount: doc.sentences().length,
    questionCount: doc.questions().length,
  };

  const reasons: string[] = [];
  let riskBoost = 0;

  if (features.hasUrgency) {
    reasons.push('Contains urgency language');
    riskBoost += 15;
  }
  if (features.hasFear) {
    reasons.push('Uses fear tactics (account suspension, etc.)');
    riskBoost += 15;
  }
  if (features.hasAuthority) {
    reasons.push('Impersonates authority (bank, SARS, government)');
    riskBoost += 10;
  }

  if (features.sentenceCount > 3 && features.questionCount === 0) {
    reasons.push('Unusually long and declarative – possible crafted scam');
    riskBoost += 5;
  }

  riskBoost = Math.min(riskBoost, 40);

  return { riskBoost, reasons, features };
}

export function detectScamKeywords(text: string): { matchedFlags: string[]; count: number } {
  const lower = text.toLowerCase();
  const matchedFlags = MESSAGE_FLAGS.filter((flag) => lower.includes(flag));
  return { matchedFlags, count: matchedFlags.length };
}